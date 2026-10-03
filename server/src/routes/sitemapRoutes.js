const express = require('express');
const Crop = require('../models/Crop');
const Product = require('../models/Product');
const BlogPost = require('../models/BlogPost');
const NGOProgram = require('../models/NGOProgram');
const Page = require('../models/Page');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/sitemap.xml',
  asyncHandler(async (req, res) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const sections = [
      { model: Crop, prefix: '/crops' },
      { model: Product, prefix: '/products' },
      { model: BlogPost, prefix: '/blog' },
      { model: NGOProgram, prefix: '/ngo/programs' },
    ];

    const urls = new Set([
      '',
      '/about',
      '/crops',
      '/products',
      '/ngo',
      '/ngo/donate',
      '/ngo/volunteer',
      '/blog',
      '/gallery',
      '/contact',
      '/shop',
    ]);

    for (const section of sections) {
      const docs = await section.model.find({ status: 'published' }).select('slug updatedAt');
      docs.forEach((doc) => urls.add(`${section.prefix}/${doc.slug}`));
    }

    // Page documents are keyed by slug ("home", "ngo-donate", ...), which don't all map
    // 1:1 onto their real route — map the exceptions explicitly and let the Set dedupe
    // everything else against the static entries above.
    const SLUG_PATH_OVERRIDES = { home: '', 'ngo-donate': '/ngo/donate', 'ngo-volunteer': '/ngo/volunteer' };
    const pages = await Page.find({ status: 'published' }).select('slug');
    pages.forEach((doc) => urls.add(SLUG_PATH_OVERRIDES[doc.slug] ?? `/${doc.slug}`));

    const body = [...urls]
      .map((path) => `  <url><loc>${clientUrl}${path}</loc></url>`)
      .join('\n');

    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  })
);

module.exports = router;
