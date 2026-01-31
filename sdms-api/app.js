const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//const db=require('./services/database');
const rootRoute = require('./routes/rootRoute');
const logger = require('./utils/logger');
const app = express();
app.use(cookieParser());
// Middleware to parse JSON data
app.use(express.json());

// Omar add for CORS start
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  methods: ['GET', 'POST'],
  credentials: true, allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Omar add for CORS end


// 👇 Add a health check root endpoint
app.get('/', (req, res) => {
  res.send('🚀 SDMS API is running');
});

// Trust the first proxy (important on Render)
app.set('trust proxy', true);


app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Global Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  // Send a JSON response with the error details
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
    // Optionally include the stack trace in development environments for debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});
// Trust the first proxy (or adjust the number for multiple proxies)
app.set('trust proxy', true);

// Routes
rootRoute(app);



// Export the app instance
module.exports = app;
