const Product = require('../models/Product');
const createContentController = require('../controllers/contentControllerFactory');
const createContentRoutes = require('./contentRouteFactory');

const controller = createContentController({
  Model: Product,
  entityType: 'Product',
  labelField: 'name',
  editableFields: ['name', 'slug', 'crop', 'description', 'images', 'specs', 'moq', 'packaging', 'status', 'seo'],
});

module.exports = createContentRoutes(controller);
