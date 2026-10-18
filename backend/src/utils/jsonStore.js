const fs = require('node:fs/promises');
const path = require('node:path');

// Serializer queue per file path to prevent concurrent race conditions
const fileQueues = new Map();

function withFileLock(filePath, action) {
  const normalizedPath = path.resolve(filePath);
  const previous = fileQueues.get(normalizedPath) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(() => action());

  fileQueues.set(normalizedPath, current);

  current.finally(() => {
    if (fileQueues.get(normalizedPath) === current) {
      fileQueues.delete(normalizedPath);
    }
  });

  return current;
}

async function readJsonArray(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    if (!raw.trim()) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error(`Data in ${filePath} is corrupted: expected a JSON array but received ${typeof parsed}.`);
    }

    return parsed;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Return empty array without mutating filesystem on read
      return [];
    }

    throw error;
  }
}

async function writeJsonArray(filePath, data) {
  if (!Array.isArray(data)) {
    throw new TypeError(`writeJsonArray requires an array, got ${typeof data}.`);
  }

  return withFileLock(filePath, async () => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
  });
}

async function updateJsonArray(filePath, updateFn) {
  return withFileLock(filePath, async () => {
    const list = await readJsonArray(filePath);
    const updated = await updateFn(list);
    if (!Array.isArray(updated)) {
      throw new TypeError(`updateJsonArray callback must return an array.`);
    }
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, 'utf-8');
    return updated;
  });
}

module.exports = {
  readJsonArray,
  writeJsonArray,
  updateJsonArray,
  withFileLock,
};

