const mongoose = require('mongoose');
const { STATUS, seoSchema, revisionSchema } = require('./shared');

const ngoProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    category: { type: String, trim: true },
    beneficiaries: { type: Number, default: 0 },
    location: { type: String, trim: true },
    status: { type: String, enum: STATUS, default: 'draft' },
    seo: { type: seoSchema, default: () => ({}) },
    revisions: [revisionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NGOProgram', ngoProgramSchema);
