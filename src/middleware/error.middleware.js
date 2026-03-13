const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal Server Error";

  if (!err.isOperational) {
    console.error("[Error]", err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message
  });
};

module.exports = { errorHandler };