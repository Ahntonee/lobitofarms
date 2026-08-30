const MediaAsset = require('../models/MediaAsset');

// Recursively walks any value (plain object, array, or Mongoose doc-as-object) and
// collects every string that looks like a locally-uploaded file URL. Generic on purpose:
// content types store images in different shapes (Crop.images[], BlogPost.coverImage,
// Page.blocks[].config.*), and Page block config is arbitrary Mixed-type JSON, so field
// names can't be enumerated up front.
function extractUploadUrls(value, found = new Set()) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) found.add(value);
  } else if (Array.isArray(value)) {
    for (const item of value) extractUploadUrls(item, found);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) extractUploadUrls(v, found);
  }
  return found;
}

// Re-derives which media assets a saved entity references and keeps MediaAsset.usedIn
// in sync: clears this entity's reference from every asset, then re-adds it wherever
// the entity's current content still points at that asset's URL.
async function syncMediaUsage({ model, id, label, doc }) {
  try {
    await MediaAsset.updateMany({ 'usedIn.model': model, 'usedIn.id': id }, { $pull: { usedIn: { model, id } } });
    // Exclude revision history: it's a record of past content, not what's live, and
    // would otherwise pin an image as "in use" forever just because an old revision
    // referenced it — defeating the point of the in-use check.
    const { revisions, ...liveDoc } = doc || {};
    const urls = Array.from(extractUploadUrls(liveDoc));
    if (urls.length > 0) {
      await MediaAsset.updateMany({ url: { $in: urls } }, { $addToSet: { usedIn: { model, id, label } } });
    }
  } catch (err) {
    console.error('Failed to sync media usage', err.message);
  }
}

async function clearMediaUsage({ model, id }) {
  try {
    await MediaAsset.updateMany({ 'usedIn.model': model, 'usedIn.id': id }, { $pull: { usedIn: { model, id } } });
  } catch (err) {
    console.error('Failed to clear media usage', err.message);
  }
}

module.exports = { syncMediaUsage, clearMediaUsage };
