const cron = require('node-cron');
const BlogPost = require('../models/BlogPost');

// Runs every minute; flips any blog post whose scheduled publishAt time has passed
// from draft/in_review into published, without requiring an editor to click publish.
function startScheduledPublishJob() {
  cron.schedule('* * * * *', async () => {
    try {
      const due = await BlogPost.find({
        status: { $in: ['draft', 'in_review'] },
        publishAt: { $lte: new Date() },
      });
      for (const post of due) {
        post.status = 'published';
        post.publishedAt = new Date();
        await post.save();
        console.log(`Scheduled publish: "${post.title}"`);
      }
    } catch (err) {
      console.error('Scheduled publish job failed', err.message);
    }
  });
}

module.exports = startScheduledPublishJob;
