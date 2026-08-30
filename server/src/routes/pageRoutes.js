const Page = require('../models/Page');
const createContentController = require('../controllers/contentControllerFactory');
const createContentRoutes = require('./contentRouteFactory');

const controller = createContentController({
  Model: Page,
  entityType: 'Page',
  labelField: 'title',
  editableFields: ['slug', 'title', 'blocks', 'status', 'seo'],
});

module.exports = createContentRoutes(controller);
