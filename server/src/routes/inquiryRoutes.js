const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many submissions from this device. Please try again later.' },
});

const validateSubmission = [
  body('name').trim().isLength({ min: 2, max: 120 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }).escape(),
  body('message').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }).escape(),
];

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Invalid submission', errors: errors.array() });
  next();
}

function submitAs(type) {
  return asyncHandler(async (req, res) => {
    const { name, email, phone, message, meta } = req.body;
    const doc = await Inquiry.create({ type, name, email, phone, message, meta: meta || {} });
    res.status(201).json({ message: 'Submitted successfully', id: doc._id });
  });
}

router.post('/contact', submitLimiter, validateSubmission, checkValidation, submitAs('contact'));
router.post('/volunteer', submitLimiter, validateSubmission, checkValidation, submitAs('volunteer'));
router.post('/donation', submitLimiter, validateSubmission, checkValidation, submitAs('donation'));
router.post('/quote', submitLimiter, validateSubmission, checkValidation, submitAs('quote'));

// Admin management
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const query = {};
    if (req.query.type) query.type = req.query.type;
    if (req.query.status) query.status = req.query.status;
    const docs = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json(docs);
  })
);

router.patch(
  '/:id/status',
  protect,
  asyncHandler(async (req, res) => {
    const doc = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!doc) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(doc);
  })
);

module.exports = router;
