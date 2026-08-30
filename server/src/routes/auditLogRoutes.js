const express = require('express');
const AuditLogEntry = require('../models/AuditLogEntry');
const { protect, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  protect,
  requireRole('editor', 'super_admin'),
  asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 100, 500);
    const entries = await AuditLogEntry.find().sort({ createdAt: -1 }).limit(limit);
    res.json(entries);
  })
);

module.exports = router;
