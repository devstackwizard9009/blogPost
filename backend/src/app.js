const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const { typeDefs, resolvers } = require("./graphql/schema");
const { errorHandler } = require("./middleware/errorHandler");

const uploadDir = path.join(__dirname, "../uploads");
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, callback) => callback(null, uploadDir),
  filename: (_, file, callback) => {
    const extension = path.extname(file.originalname) || ".jpg";
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
  fileFilter: (_, file, callback) => {
    if (/image\/(jpeg|jpg|png|webp)/i.test(file.mimetype)) {
      callback(null, true);
      return;
    }
    const error = new Error("Only JPG, PNG, or WEBP images are allowed.");
    error.status = 400;
    callback(error);
  },
});

const startHttpServer = async ({ port }) => {
  const app = express();
  const apolloServer = new ApolloServer({ typeDefs, resolvers });
  await apolloServer.start();

  app.use(cors());
  app.use(express.json());
  app.use("/images/uploads", express.static(uploadDir));

  app.post("/upload", (req, res, next) => {
    upload.single("image")(req, res, (error) => {
      if (error) {
        next(error);
        return;
      }

      if (!req.file) {
        const missingFileError = new Error("No image file provided.");
        missingFileError.status = 400;
        next(missingFileError);
        return;
      }

      res.json({ url: `/images/uploads/${req.file.filename}` });
    });
  });

  app.use("/", expressMiddleware(apolloServer));

  // Must be registered after all routes
  app.use(errorHandler);

  await new Promise((resolve) => {
    app.listen(port, resolve);
  });

  return { url: `http://localhost:${port}/` };
};

module.exports = { startHttpServer };
