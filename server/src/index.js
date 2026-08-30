require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const startScheduledPublishJob = require('./jobs/scheduledPublish');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Lobito Farms API running on port ${PORT}`);
      startScheduledPublishJob();
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
