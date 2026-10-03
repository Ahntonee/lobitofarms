const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    singleton: { type: String, default: 'main', unique: true },
    siteName: { type: String, default: 'Lobito Farms' },
    tagline: { type: String, default: '' },
    logo: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    footerText: { type: String, default: '' },
    theme: {
      primaryColor: { type: String, default: '#2f5233' },
      accentColor: { type: String, default: '#c98a3a' },
    },
    navLinks: [
      {
        label: { type: String, required: true },
        path: { type: String, required: true },
      },
    ],
    footerLinkGroups: [
      {
        title: { type: String, required: true },
        links: [
          {
            label: { type: String, required: true },
            path: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
