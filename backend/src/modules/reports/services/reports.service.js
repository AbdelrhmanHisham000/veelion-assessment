const path = require('node:path');
const { readJsonArray } = require('../../../utils/jsonStore');

const DATA_DIR = process.env.DATA_DIR || path.resolve(__dirname, '../../../../data');
const TASKS_FILE_PATH = path.join(DATA_DIR, 'tasks.json');
const ACTIVITY_FILE_PATH = path.join(DATA_DIR, 'activity.json');


async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  const byStatus = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };

  for (const task of tasks) {
    if (task.status === 'in-progress' || task.inProgress === true) {
      byStatus['in-progress'] += 1;
    } else if (task.status === 'done' || task.completed === true) {
      byStatus.done += 1;
    } else {
      byStatus.todo += 1;
    }
  }

  return {
    total: tasks.length,
    byStatus,
    recentActivityCount: activities.length,
  };
}

module.exports = {
  getTasksSummary,
};
