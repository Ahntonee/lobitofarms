const Crop = require('../models/Crop');
const createContentController = require('../controllers/contentControllerFactory');
const createContentRoutes = require('./contentRouteFactory');

const controller = createContentController({
  Model: Crop,
  entityType: 'Crop',
  labelField: 'name',
  editableFields: ['name', 'slug', 'category', 'description', 'images', 'season', 'exportGrade', 'status', 'seo'],
});

module.exports = createContentRoutes(controller);
