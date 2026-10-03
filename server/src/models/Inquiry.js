const mongoose = require('mongoose');

const TYPES = ['contact', 'volunteer', 'donation', 'quote', 'order'];
const INQUIRY_STATUS = ['new', 'read', 'responded', 'archived'];

const inquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: TYPES, required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    message: { type: String, default: '' },
    status: { type: String, enum: INQUIRY_STATUS, default: 'new' },
    // type-specific extras, e.g. { productId, quantity } for quote, { amount, frequency } for donation
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
module.exports.TYPES = TYPES;
module.exports.INQUIRY_STATUS = INQUIRY_STATUS;
