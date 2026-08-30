const express = require('express');
const SiteSettings = require('../models/SiteSettings');
const { protect, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { syncMediaUsage } = require('../utils/mediaUsage');

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ singleton: 'main' });
  if (!settings) settings = await SiteSettings.create({ singleton: 'main' });
  return settings;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    res.json(settings);
  })
);

router.put(
  '/',
  protect,
  requireRole('super_admin'),
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body, { singleton: 'main' });
    await settings.save();
    await syncMediaUsage({ model: 'SiteSettings', id: settings._id, label: 'Site Settings', doc: settings.toObject() });
    res.json(settings);
  })
);

module.exports = router;
