const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DIALECT: process.env.DIALECT,
  SECRET_KEY: process.env.SECRET_KEY,
  INIT_DB: process.env.INIT_DB,
  PASS_ENCRYPTION: process.env.PASS_ENCRYPTION,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_USER: process.env.MAIL_USER,
  FROM_MAIL: process.env.FROM_MAIL,
  TIME_FORMAT: process.env.TIME_FORMAT,
  MAX_SIZE: process.env.MAX_SIZE,
  LOG_LEVEL: process.env.LOG_LEVEL,
  FILE_NAME: process.env.FILE_NAME,
  FOLDER_PATH: process.env.FOLDER_PATH,
  ALGORITHM: process.env.ALGORITHM,
  EXPIRES_IN: process.env.EXPIRES_IN,
  FILE_SIZE: process.env.FILE_SIZE,
};
