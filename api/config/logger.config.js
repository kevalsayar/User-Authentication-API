/**
 * Logger configurations
 */
const winston = require("winston"),
  {
    TIME_FORMAT,
    MAX_SIZE,
    LOG_LEVEL,
    FILE_NAME,
    LOGGER_ERROR_PATH,
    LOGGER_COMBINED_PATH,
  } = require("../../env");
require("winston-daily-rotate-file");

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.json(),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: FILE_NAME,
      dirname: process.cwd() + `${LOGGER_ERROR_PATH}`,
      level: "error",
      datePattern: TIME_FORMAT,
      maxSize: MAX_SIZE,
    }),
    new winston.transports.DailyRotateFile({
      filename: FILE_NAME,
      dirname: process.cwd() + `${LOGGER_COMBINED_PATH}`,
      datePattern: TIME_FORMAT,
      maxSize: MAX_SIZE,
    }),
  ],
});

module.exports = {
  logger,
};
