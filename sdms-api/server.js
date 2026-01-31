require('dotenv').config();
const app = require('./app');
const dbConnection = require('./services/shared/database');
const port = process.env.PORT || 8000;

// Handling uncaught exception
process.on('uncaughtException', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception.');
  server.close(() => {
      process.exit(1);   

  });
});

// Start the server
(async function startServer() {
  try {
    //await dbConnection.initialize();
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down the server due to handled promise rejection.');
  server.close(() => {
      process.exit(1);   

  });
});
