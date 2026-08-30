const BlogPost = require('../models/BlogPost');
const createContentController = require('../controllers/contentControllerFactory');
const createContentRoutes = require('./contentRouteFactory');

const controller = createContentController({
  Model: BlogPost,
  entityType: 'BlogPost',
  labelField: 'title',
  editableFields: [
    'title', 'slug', 'body', 'excerpt', 'coverImage', 'tags', 'category', 'status', 'publishAt', 'seo',
  ],
});

module.exports = createContentRoutes(controller);
