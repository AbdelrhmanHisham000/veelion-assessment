const activityService = require('../services/activity.service');
const { validateActivityPayload } = require('../utils/activityValidator');

async function getActivity(req, res) {
  const activity = await activityService.getAllActivity();
  res.status(200).json({ data: activity });
}

async function addActivity(req, res) {
  const validatedPayload = validateActivityPayload(req.body);
  const created = await activityService.createNewActivity(validatedPayload);
  res.status(201).json({ data: created });
}

module.exports = {
  get_activity: getActivity,
  getActivity,
  addActivity,
};

