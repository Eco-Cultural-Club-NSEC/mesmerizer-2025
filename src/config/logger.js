import { createLogger, format, transports } from "winston";

// Check if we're in production (Vercel) or development environment
const isProduction = process.env.NODE_ENV === 'production';

// Create the logger with appropriate transports based on environment
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // Console transport is safe in all environments
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

// Only add file transports in development environment
if (!isProduction) {
  // These file transports will only be used locally, not in Vercel
  logger.add(new transports.File({ filename: "logs/error.log", level: "error" }));
  logger.add(new transports.File({ filename: "logs/combined.log" }));
  
  // Add exception and rejection handlers for local development
  logger.exceptions.handle(new transports.File({ filename: "logs/exceptions.log" }));
  logger.rejections.handle(new transports.File({ filename: "logs/rejections.log" }));
}

export default logger;