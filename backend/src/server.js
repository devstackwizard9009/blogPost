const { env } = require("./config/env");
const { connectDatabase, disconnectDatabase } = require("./config/database");
const { startHttpServer } = require("./app");

const bootstrap = async () => {
  await connectDatabase(env.mongoUri);
  const { url } = await startHttpServer({ port: env.port });
  console.log(`API running at ${url}`);
};

const shutdown = async () => {
  try {
    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

bootstrap().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
