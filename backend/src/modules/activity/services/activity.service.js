const path = require('node:path');
const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');

const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, '../../../../data');
const ACTIVITY_FILE_PATH = path.join(DATA_DIR, 'activity.json');


async function getAllActivity() {
  return readJsonArray(ACTIVITY_FILE_PATH);
}

async function createNewActivity(payload) {
  const list = await readJsonArray(ACTIVITY_FILE_PATH);
  const newActivity = {
    id: createId(),
    action: payload.action ?? '',
    info: payload.info ?? '',
    when: new Date().toISOString(),
  };

  list.push(newActivity);
  await writeJsonArray(ACTIVITY_FILE_PATH, list);
  return newActivity;
}

module.exports = {
  getAllActivity,
  createNewActivity,
};

