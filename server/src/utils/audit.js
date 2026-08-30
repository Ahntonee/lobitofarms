const AuditLogEntry = require('../models/AuditLogEntry');

async function logAction({ user, action, entityType, entityId, entityLabel }) {
  try {
    await AuditLogEntry.create({
      user: user?._id,
      userName: user?.name,
      action,
      entityType,
      entityId,
      entityLabel,
    });
  } catch (err) {
    console.error('Failed to write audit log entry', err.message);
  }
}

module.exports = { logAction };
