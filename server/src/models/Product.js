const mongoose = require('mongoose');
const { STATUS, seoSchema, revisionSchema } = require('./shared');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
    description: { type: String, default: '' },
    images: [{ type: String }],
    specs: { type: String, default: '' },
    moq: { type: String, default: '' },
    packaging: { type: String, default: '' },
    status: { type: String, enum: STATUS, default: 'draft' },
    seo: { type: seoSchema, default: () => ({}) },
    revisions: [revisionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
