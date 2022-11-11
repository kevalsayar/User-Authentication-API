const { Op } = require("sequelize"),
  { UserModel, PersistentTokensModel } = require("./user.model");

const UserQueries = function () {
  const createUser = async function (user) {
    const results = await UserModel.create({
      uuid: user?.uuid,
      name: user?.name,
      age: user?.age,
      email: user?.email,
      password: user?.password,
      company: user?.company,
      uuidhash: user?.uuidhash,
    });
    return results ? results.dataValues : false;
  };

  const userVerificationStatus = async function (columnName, val) {
    const results = await UserModel.findOne({
      where: {
        [columnName]: val,
      },
      attributes: ["is_verified"],
    });
    return results.dataValues["is_verified"] ? true : false;
  };

  const checkUserExistance = async function (columnName, val) {
    const results = await UserModel.findOne({
      where: {
        [columnName]: val,
      },
    });
    return results;
  };

  const getSingleUser = async function (columnName, val) {
    const results = await UserModel.findOne({
      where: {
        [columnName]: val,
      },
      raw: true,
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "uuidhash",
          "is_verified",
        ],
      },
    });
    return results;
  };

  const getAllUsers = async function (offset = 0, limit = 10) {
    const results = await UserModel.findAll({
      raw: true,
      offset,
      limit,
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "uuidhash",
          "is_verified",
        ],
      },
      order: [["createdAt", "DESC"]],
    });
    return results;
  };

  const userPassUpdate = async function (email, newPassword) {
    const results = await UserModel.update(
      {
        password: newPassword,
      },
      {
        where: {
          email,
        },
      }
    );
    return results ? true : false;
  };

  const removeUser = async function (uuid) {
    const results = await UserModel.destroy({
      where: {
        uuid,
      },
    });
    return results ? true : false;
  };

  const searchInfo = async (searchString, offset = 0, limit = 10) => {
    const queryResult = await UserModel.findAndCountAll({
      raw: true,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${searchString}%`,
            },
          },
          {
            company: {
              [Op.like]: `%${searchString}%`,
            },
          },
        ],
      },
      limit,
      offset,
      attributes: ["name", "email", "company"],
      order: [["createdAt", "DESC"]],
    });
    return queryResult;
  };

  const userVerificationUpdate = async function (uuidhash) {
    const results = await UserModel.update(
      {
        is_verified: 1,
      },
      {
        where: {
          uuidhash,
        },
      }
    );
    return results ? true : false;
  };

  return {
    createUser,
    checkUserExistance,
    getSingleUser,
    getAllUsers,
    userPassUpdate,
    removeUser,
    searchInfo,
    userVerificationStatus,
    userVerificationUpdate,
  };
};

const PersistentTokensQueries = function () {
  const addNewUserToken = async function (token, publicKey, uuid) {
    const results = await PersistentTokensModel.create({
      uuid: uuid,
      jwt: token,
      publicKey: publicKey,
    });
    return results;
  };

  const checkUserExistance = async function (columnName, val) {
    const results = await PersistentTokensModel.findOne({
      where: {
        [columnName]: val,
      },
    });
    return results;
  };

  const getPublicKey = async function (jwt) {
    const results = await PersistentTokensModel.findOne({
      raw: true,
      where: {
        jwt,
      },
      attributes: ["jwt", "publicKey"],
    });
    return results ? results : false;
  };

  const removeToken = async function (jwt) {
    const results = await PersistentTokensModel.destroy({
      where: {
        jwt,
      },
    });
    return results ? true : false;
  };

  return {
    addNewUserToken,
    getPublicKey,
    removeToken,
    checkUserExistance,
  };
};

module.exports = {
  UserModel: UserQueries(),
  PersistentTokenModel: PersistentTokensQueries(),
};
