const getStatusCode = (error) => {
  if (error.status || error.statusCode) {
    return error.status || error.statusCode;
  }

  if (error.code === "LIMIT_FILE_SIZE" || error.name === "MulterError") {
    return 400;
  }

  if (error.type === "entity.parse.failed") {
    return 400;
  }

  return 500;
};

const getErrorMessage = (error) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return "Image must be 5MB or smaller.";
  }

  if (error?.message) {
    return error.message;
  }

  return "Internal server error.";
};

const errorHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const status = getStatusCode(error);
  const message = getErrorMessage(error);

  if (status >= 500) {
    console.error("[error]", error);
  }

  res.status(status).json({
    error: message,
  });
};

module.exports = { errorHandler };
