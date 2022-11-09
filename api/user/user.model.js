const { db } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { INIT_DB } = require("../../env");

const UserModel = db.define("user", {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  age: {
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
  },
  uuidhash: {
    type: DataTypes.STRING,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
  },
});

const PersistentTokensModel = db.define("persistent_tokens", {
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  jwt: {
    type: DataTypes.STRING(500),
  },
  publicKey: {
    type: DataTypes.STRING(1500),
  },
});

UserModel.sync({ force: INIT_DB == "true" ? true : false });
PersistentTokensModel.sync({ force: INIT_DB == "true" ? true : false });
module.exports = { UserModel, PersistentTokensModel };
