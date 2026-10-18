class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = 'HttpError';
    const isValidStatus =
      Number.isInteger(statusCode) && statusCode >= 400 && statusCode <= 599;
    this.statusCode = isValidStatus ? statusCode : 500;
    this.details = details;
  }
}

module.exports = HttpError;

