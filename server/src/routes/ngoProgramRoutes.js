const NGOProgram = require('../models/NGOProgram');
const createContentController = require('../controllers/contentControllerFactory');
const createContentRoutes = require('./contentRouteFactory');

const controller = createContentController({
  Model: NGOProgram,
  entityType: 'NGOProgram',
  labelField: 'title',
  editableFields: ['title', 'slug', 'description', 'image', 'category', 'beneficiaries', 'location', 'status', 'seo'],
});

module.exports = createContentRoutes(controller);
