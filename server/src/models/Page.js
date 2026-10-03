const mongoose = require('mongoose');
const { STATUS, seoSchema, revisionSchema } = require('./shared');

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        'hero',
        'text_image',
        'stat_counters',
        'testimonial_carousel',
        'card_grid',
        'cta_banner',
        'gallery_grid',
        'page_header',
        'donate_form',
      ],
    },
    order: { type: Number, required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    blocks: [blockSchema],
    status: { type: String, enum: STATUS, default: 'draft' },
    seo: { type: seoSchema, default: () => ({}) },
    revisions: [revisionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', pageSchema);
