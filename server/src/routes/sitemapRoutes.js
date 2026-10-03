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
      '/careers',
    ]);

    for (const section of sections) {
      const docs = await section.model.find({ status: 'published' }).select('slug updatedAt');
      docs.forEach((doc) => urls.add(`${section.prefix}/${doc.slug}`));
    }

    // Page documents are keyed by slug ("home", "about", "ngo"), but the home page's
    // real route is "/" not "/home" — map it explicitly instead of concatenating the
    // slug, and let the Set dedupe against the static entries above.
    const pages = await Page.find({ status: 'published' }).select('slug');
    pages.forEach((doc) => urls.add(doc.slug === 'home' ? '' : `/${doc.slug}`));

    const body = [...urls]
      .map((path) => `  <url><loc>${clientUrl}${path}</loc></url>`)
      .join('\n');

    res.set('Content-Type', 'application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`);
  })
);

module.exports = router;
