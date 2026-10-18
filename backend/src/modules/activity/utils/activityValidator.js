const HttpError = require('../../../utils/httpError');

const ALLOWED_FIELDS = ['action', 'info'];

function validateActivityPayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Body must be a JSON object.');
  }

  const unknownFields = Object.keys(payload).filter(
    (field) => !ALLOWED_FIELDS.includes(field)
  );

  if (unknownFields.length > 0) {
    throw new HttpError(400, 'Body contains unsupported fields.', {
      unsupportedFields: unknownFields,
    });
  }

  const normalized = {};

  if (Object.hasOwn(payload, 'action')) {
    if (typeof payload.action !== 'string') {
      throw new HttpError(400, '"action" must be a string.');
    }
    normalized.action = payload.action.trim();
  }

  if (Object.hasOwn(payload, 'info')) {
    if (typeof payload.info !== 'string') {
      throw new HttpError(400, '"info" must be a string.');
    }
    normalized.info = payload.info.trim();
  }

  return normalized;
}

module.exports = {
  validateActivityPayload,
};
