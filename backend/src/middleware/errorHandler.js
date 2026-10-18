const HttpError = require('../utils/httpError');

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isValidStatus =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599;

  const statusCode = isValidStatus ? error.statusCode : 500;
  const message = statusCode >= 500 ? 'Internal server error' : error.message;

  const response = {
    error: {
      message,
    },
  };

  // Only expose details for client errors (4xx) to prevent leaking internal server info
  if (statusCode < 500 && error instanceof HttpError && error.details) {
    response.error.details = error.details;
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
