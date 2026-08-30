const mongoose = require('mongoose');

const mediaAssetSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String },
    size: { type: Number },
    tags: [{ type: String, trim: true }],
    folder: { type: String, default: 'general', trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usedIn: [
      {
        model: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId },
        label: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MediaAsset', mediaAssetSchema);
