const { Sequelize } = require("sequelize");
const {
  DB_HOST,
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DIALECT,
} = require("../../env.js");

const db = new Sequelize({
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_NAME,
  dialect: DIALECT,
});

db.authenticate()
  .then(() => {
    console.log("Database Connection's been established successfully!");
  })
  .catch((error) => {
    console.error("Unable to connect to the database!", error);
  });

module.exports = {
  db,
};
