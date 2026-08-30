const { logAction } = require('../utils/audit');
const { syncMediaUsage, clearMediaUsage } = require('../utils/mediaUsage');

const MAX_REVISIONS = 25;

// Builds a standard set of CRUD + status-workflow + revision-history handlers for a
// Mongoose model that follows the shared { status, seo, revisions } shape. Used for
// Crop, Product, BlogPost, NGOProgram, and Page so the workflow logic (draft/publish,
// revision snapshotting, audit logging, role gating) lives in exactly one place.
function createContentController({ Model, entityType, editableFields, labelField = 'name', onBeforeSave }) {
  function pickEditable(body) {
    const data = {};
    for (const field of editableFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) data[field] = body[field];
    }
    return data;
  }

  async function list(req, res) {
    const query = {};
    if (req.user) {
      if (req.query.status) query.status = req.query.status;
    } else {
      query.status = 'published';
    }
    const docs = await Model.find(query).sort({ createdAt: -1 }).select('-revisions');
    res.json(docs);
  }

  async function getPublicBySlug(req, res) {
    const doc = await Model.findOne({ slug: req.params.slug, status: 'published' }).select('-revisions');
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });
    res.json(doc);
  }

  async function getById(req, res) {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });
    res.json(doc);
  }

  async function create(req, res) {
    const data = pickEditable(req.body);
    if (req.user.role === 'contributor') data.status = 'draft';
    if (onBeforeSave) await onBeforeSave(data, { isNew: true });

    const doc = await Model.create({
      ...data,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await logAction({
      user: req.user,
      action: 'create',
      entityType,
      entityId: doc._id,
      entityLabel: doc[labelField],
    });
    await syncMediaUsage({ model: entityType, id: doc._id, label: doc[labelField], doc: doc.toObject() });
    res.status(201).json(doc);
  }

  async function update(req, res) {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });

    const data = pickEditable(req.body);
    if (req.user.role === 'contributor') {
      delete data.status;
      if (doc.status === 'published') {
        return res.status(403).json({ message: 'Contributors cannot edit published content' });
      }
    }
    if (onBeforeSave) await onBeforeSave(data, { isNew: false, doc });

    // Snapshot the pre-change state before applying edits.
    const snapshot = doc.toObject();
    delete snapshot.revisions;
    doc.revisions = doc.revisions || [];
    doc.revisions.unshift({ data: snapshot, editedBy: req.user._id, editedAt: new Date() });
    if (doc.revisions.length > MAX_REVISIONS) doc.revisions = doc.revisions.slice(0, MAX_REVISIONS);

    Object.assign(doc, data);
    doc.updatedBy = req.user._id;
    await doc.save();

    await logAction({
      user: req.user,
      action: 'update',
      entityType,
      entityId: doc._id,
      entityLabel: doc[labelField],
    });
    await syncMediaUsage({ model: entityType, id: doc._id, label: doc[labelField], doc: doc.toObject() });
    res.json(doc);
  }

  async function updateStatus(req, res) {
    const { status } = req.body;
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });

    doc.status = status;
    if (status === 'published' && 'publishedAt' in doc.schema.paths) {
      doc.publishedAt = new Date();
    }
    doc.updatedBy = req.user._id;
    await doc.save();

    await logAction({
      user: req.user,
      action: `status:${status}`,
      entityType,
      entityId: doc._id,
      entityLabel: doc[labelField],
    });
    res.json(doc);
  }

  async function remove(req, res) {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });
    await doc.deleteOne();

    await logAction({
      user: req.user,
      action: 'delete',
      entityType,
      entityId: doc._id,
      entityLabel: doc[labelField],
    });
    await clearMediaUsage({ model: entityType, id: doc._id });
    res.json({ message: 'Deleted' });
  }

  async function listRevisions(req, res) {
    const doc = await Model.findById(req.params.id).select('revisions');
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });
    res.json(doc.revisions);
  }

  async function restoreRevision(req, res) {
    const doc = await Model.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: `${entityType} not found` });
    const revision = doc.revisions[Number(req.params.index)];
    if (!revision) return res.status(404).json({ message: 'Revision not found' });

    const currentSnapshot = doc.toObject();
    delete currentSnapshot.revisions;
    const restoredData = { ...revision.data };
    delete restoredData._id;
    delete restoredData.revisions;
    delete restoredData.createdAt;
    delete restoredData.updatedAt;
    delete restoredData.__v;

    doc.revisions.unshift({ data: currentSnapshot, editedBy: req.user._id, editedAt: new Date() });
    Object.assign(doc, restoredData);
    doc.updatedBy = req.user._id;
    await doc.save();

    await logAction({
      user: req.user,
      action: 'restore_revision',
      entityType,
      entityId: doc._id,
      entityLabel: doc[labelField],
    });
    await syncMediaUsage({ model: entityType, id: doc._id, label: doc[labelField], doc: doc.toObject() });
    res.json(doc);
  }

  return { list, getPublicBySlug, getById, create, update, updateStatus, remove, listRevisions, restoreRevision };
}

module.exports = createContentController;
