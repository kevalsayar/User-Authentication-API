const dotenv = require("dotenv");
dotenv.config();

module.exports = {
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
};