const mongoose = require('mongoose');

const STATUS = ['draft', 'in_review', 'published', 'archived'];

const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    ogImage: { type: String, trim: true },
  },
  { _id: false }
);

const revisionSchema = new mongoose.Schema(
  {
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    editedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    editedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

module.exports = { STATUS, seoSchema, revisionSchema };
