const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Check if logging is enabled through environment variables
const loggingEnabled = process.env.LOGGING_ENABLED === 'TRUE';

// Create the logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [] // Start with an empty transports array
});

if (loggingEnabled) {
  logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new transports.File({ filename: 'logs/combined.log' }));

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: combine(
        timestamp(),
        logFormat
      )
    }));
  }
}

// Prevent Winston from attempting to write logs with no transports
if (logger.transports.length === 0) {
  logger.add(new transports.Console({
    format: combine(
      timestamp(),
      logFormat
    ),
    silent: true // You can set this to true to prevent console output if you don't want any logging
  }));
}

module.exports = logger;
