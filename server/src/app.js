const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const { notFound, errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cropRoutes = require('./routes/cropRoutes');
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const ngoProgramRoutes = require('./routes/ngoProgramRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const pageRoutes = require('./routes/pageRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const siteSettingsRoutes = require('./routes/siteSettingsRoutes');
const sitemapRoutes = require('./routes/sitemapRoutes');

const app = express();

// `cors`'s own rule: it will happily set Access-Control-Allow-Origin: * alongside
// Allow-Credentials: true, but every browser then refuses the response outright (the
// two are mutually exclusive per spec). Falling back to '*' when CLIENT_URL is unset
// looked harmless in dev (CLIENT_URL is always set here) but would silently break every
// credentialed request in a production deploy that forgot to set it. Support a
// comma-separated list so multiple real origins (e.g. a custom domain + GH Pages
// preview) can be allowed, and default to the known dev origin instead of '*'.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      // No Origin header (curl, server-to-server, same-origin) — allow.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Uploaded filenames are timestamp+random and never reused for different content, so a
// long cache lifetime is safe — the previous default (maxAge: 0) made every image on
// every page re-download on every visit.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'), { maxAge: '30d', etag: true }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Role-aware response caching. Authenticated requests can return per-role content
// (drafts, revisions, other users' emails, audit history) that must never be cached by
// a shared cache or left on disk — those always get no-store. Anonymous GETs are public
// content that rarely changes, so a short cache takes real load off MongoDB.
app.use('/api', (req, res, next) => {
  if (req.headers.authorization) {
    res.set('Cache-Control', 'no-store');
  } else if (req.method === 'GET') {
    // Short on purpose: long enough to absorb a burst of simultaneous visitors hitting
    // the same page, short enough that an editor publishing a change still sees it
    // reflected on the live site within seconds instead of wondering if it "took".
    res.set('Cache-Control', 'public, max-age=15');
  } else {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// Reads the role claim out of the JWT for rate-limit tiering only, without verifying
// the signature — `protect`/`requireRole` further down the chain do the real
// authentication, so a forged role here only ever buys a bigger quota, never access.
function roleTier(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return 'anonymous';
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return ['super_admin', 'editor', 'contributor'].includes(payload.role) ? payload.role : 'anonymous';
  } catch {
    return 'anonymous';
  }
}

const RATE_LIMIT_BY_ROLE = { anonymous: 300, contributor: 500, editor: 700, super_admin: 1000 };

// General-purpose ceiling so no single client can hammer the API and starve everyone
// else; the stricter per-route limiters (login, inquiries) still apply on top. Logged-in
// CMS users get a higher ceiling than anonymous site visitors since the admin UI
// legitimately fires more requests per minute (page builder saves, revision checks).
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: (req) => RATE_LIMIT_BY_ROLE[roleTier(req)],
    keyGenerator: (req) => `${req.ip}:${roleTier(req)}`,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/products', productRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ngo-programs', ngoProgramRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/audit-log', auditLogRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/', sitemapRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
