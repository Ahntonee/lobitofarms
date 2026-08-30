const mongoose = require('mongoose');
const { STATUS, seoSchema, revisionSchema } = require('./shared');

const cropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, trim: true },
    description: { type: String, default: '' },
    images: [{ type: String }],
    season: { type: String, trim: true },
    exportGrade: { type: String, trim: true },
    status: { type: String, enum: STATUS, default: 'draft' },
    seo: { type: seoSchema, default: () => ({}) },
    revisions: [revisionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
