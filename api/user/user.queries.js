const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const { User, PersistentTokensModel } = require("./user.model");

const UserQueries = function () {
  const createUser = async function (user) {
    const results = await User.create({
      uuid: uuidv4(),
      name: user?.name,
      age: user?.age,
      email: user?.email,
      password: user?.password,
      company: user?.company,
    });
    return results ? true : false;
  };

  const checkUserExistance = async function (columnName, val) {
    const results = await User.findOne({
      where: {
        [columnName]: val,
      },
    });
    return results;
  };

  const getAllUsers = async function () {
    const results = await User.findAll();
    const arr = [];
    for (result in results) {
      arr.push(results[result].dataValues);
    }
    return arr;
  };

  const userPassUpdate = async function (email, newPassword) {
    const results = await User.update(
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
    const results = await User.destroy({
      where: {
        uuid,
      },
    });
    return results ? true : false;
  };

  const searchInfo = async (searchString, offset = 0, limit = 10) => {
    const queryResult = await User.findAndCountAll({
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
      order: [["updatedAt", "DESC"]],
    });
    return queryResult;
  };

  return {
    createUser,
    checkUserExistance,
    getAllUsers,
    userPassUpdate,
    removeUser,
    searchInfo,
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

  const getPublicKey = async function (jwt) {
    const results = await PersistentTokensModel.findOne({
      where: {
        jwt,
      },
      attributes: ["jwt", "publicKey"],
    });
    return results ? results.dataValues : false;
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
  };
};

module.exports = {
  UserModel: UserQueries(),
  PersistentTokenModel: PersistentTokensQueries(),
};
