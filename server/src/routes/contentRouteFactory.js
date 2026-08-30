const express = require('express');
const { protect, optionalAuth, requireRole } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

function createContentRoutes(controller) {
  const router = express.Router();
  const editRoles = requireRole('editor', 'super_admin');

  router.get('/', optionalAuth, asyncHandler(controller.list));
  router.get('/slug/:slug', asyncHandler(controller.getPublicBySlug));
  router.get('/:id', protect, asyncHandler(controller.getById));
  router.post('/', protect, asyncHandler(controller.create));
  router.put('/:id', protect, asyncHandler(controller.update));
  router.patch('/:id/status', protect, editRoles, asyncHandler(controller.updateStatus));
  router.delete('/:id', protect, editRoles, asyncHandler(controller.remove));
  router.get('/:id/revisions', protect, asyncHandler(controller.listRevisions));
  router.post('/:id/revisions/:index/restore', protect, editRoles, asyncHandler(controller.restoreRevision));

  return router;
}

module.exports = createContentRoutes;
