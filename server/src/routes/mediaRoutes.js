const express = require('express');
const MediaAsset = require('../models/MediaAsset');
const { protect, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../utils/audit');

const router = express.Router();
const editRoles = requireRole('editor', 'super_admin');

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.folder) query.folder = req.query.folder;
    if (req.query.tag) query.tags = req.query.tag;
    const docs = await MediaAsset.find(query).sort({ createdAt: -1 });
    res.json(docs);
  })
);

router.post(
  '/upload',
  protect,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const tags = req.body.tags ? String(req.body.tags).split(',').map((t) => t.trim()).filter(Boolean) : [];
    const doc = await MediaAsset.create({
      url: `/uploads/${req.file.filename}`,
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      tags,
      folder: req.body.folder || 'general',
      uploadedBy: req.user._id,
    });

    await logAction({ user: req.user, action: 'upload', entityType: 'MediaAsset', entityId: doc._id, entityLabel: doc.filename });
    res.status(201).json(doc);
  })
);

router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { tags, folder } = req.body;
    const doc = await MediaAsset.findByIdAndUpdate(
      req.params.id,
      { ...(tags && { tags }), ...(folder && { folder }) },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Asset not found' });
    res.json(doc);
  })
);

router.delete(
  '/:id',
  protect,
  editRoles,
  asyncHandler(async (req, res) => {
    const doc = await MediaAsset.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Asset not found' });

    if (doc.usedIn && doc.usedIn.length > 0 && req.query.force !== 'true') {
      return res.status(409).json({
        message: 'This asset is used elsewhere. Pass force=true to delete anyway.',
        usedIn: doc.usedIn,
      });
    }

    await doc.deleteOne();
    await logAction({ user: req.user, action: 'delete', entityType: 'MediaAsset', entityId: doc._id, entityLabel: doc.filename });
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
