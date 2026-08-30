const mongoose = require('mongoose');
const { STATUS, seoSchema, revisionSchema } = require('./shared');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    body: { type: String, default: '' },
    excerpt: { type: String, default: '', maxlength: 300 },
    coverImage: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    status: { type: String, enum: STATUS, default: 'draft' },
    publishAt: { type: Date },
    publishedAt: { type: Date },
    seo: { type: seoSchema, default: () => ({}) },
    revisions: [revisionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);
