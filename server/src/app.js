const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

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

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

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
