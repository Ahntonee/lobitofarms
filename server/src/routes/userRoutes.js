const express = require('express');
const User = require('../models/User');
const { protect, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');
const { logAction } = require('../utils/audit');

const router = express.Router();
const superAdminOnly = requireRole('super_admin');

router.get(
  '/',
  protect,
  superAdminOnly,
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((u) => u.toSafeJSON()));
  })
);

router.post(
  '/',
  protect,
  superAdminOnly,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password are required' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'A user with this email already exists' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash, role: role || 'contributor' });

    await logAction({ user: req.user, action: 'create', entityType: 'User', entityId: user._id, entityLabel: user.email });
    res.status(201).json(user.toSafeJSON());
  })
);

router.put(
  '/:id',
  protect,
  superAdminOnly,
  asyncHandler(async (req, res) => {
    const { name, role, active, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof active === 'boolean') user.active = active;
    if (password) user.passwordHash = await User.hashPassword(password);
    await user.save();

    await logAction({ user: req.user, action: 'update', entityType: 'User', entityId: user._id, entityLabel: user.email });
    res.json(user.toSafeJSON());
  })
);

router.delete(
  '/:id',
  protect,
  superAdminOnly,
  asyncHandler(async (req, res) => {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await logAction({ user: req.user, action: 'delete', entityType: 'User', entityId: user._id, entityLabel: user.email });
    res.json({ message: 'Deleted' });
  })
);

module.exports = router;
