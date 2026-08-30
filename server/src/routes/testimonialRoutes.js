const express = require('express');
const Testimonial = require('../models/Testimonial');
const { protect, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../utils/audit');
const { syncMediaUsage, clearMediaUsage } = require('../utils/mediaUsage');

const router = express.Router();
const editRoles = requireRole('editor', 'super_admin');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const docs = await Testimonial.find().sort({ createdAt: -1 });
    res.json(docs);
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { name, role, quote, image, featured } = req.body;
    const doc = await Testimonial.create({ name, role, quote, image, featured });
    await logAction({ user: req.user, action: 'create', entityType: 'Testimonial', entityId: doc._id, entityLabel: doc.name });
    await syncMediaUsage({ model: 'Testimonial', id: doc._id, label: doc.name, doc: doc.toObject() });
    res.status(201).json(doc);
  })
);

router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const { name, role, quote, image, featured } = req.body;
    const doc = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { name, role, quote, image, featured },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ message: 'Testimonial not found' });
    await logAction({ user: req.user, action: 'update', entityType: 'Testimonial', entityId: doc._id, entityLabel: doc.name });
    await syncMediaUsage({ model: 'Testimonial', id: doc._id, label: doc.name, doc: doc.toObject() });
    res.json(doc);
  })
);

router.delete(
  '/:id',
  protect,
  editRoles,
  asyncHandler(async (req, res) => {
    const doc = await Testimonial.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Testimonial not found' });
    await logAction({ user: req.user, action: 'delete', entityType: 'Testimonial', entityId: doc._id, entityLabel: doc.name });
    await clearMediaUsage({ model: 'Testimonial', id: doc._id });
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
