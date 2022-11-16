const { Op } = require("sequelize"),
  { UserModel, PersistentTokensModel } = require("./user.model");

const UserQueries = function () {
  /**
   * @description create user
   * @param {User} user
   * @returns
   */
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

  /**
   * @description checks verification of user
   * @param {String} columnName
   * @param {String} val
   * @returns
   */
  const userVerificationStatus = async function (columnName, val) {
    const results = await UserModel.findOne({
      where: {
        [columnName]: val,
      },
      attributes: ["is_verified"],
    });
    return results.dataValues["is_verified"] ? true : false;
  };

  /**
   * @description checks existance of user
   * @param {String} columnName
   * @param {String} val
   * @returns
   */
  const checkUserExistance = async function (columnName, val) {
    const results = await UserModel.findOne({
      where: {
        [columnName]: val,
      },
    });
    return results ? results : false;
  };

  /**
   * @description returns details of a particular user
   * @param {String} columnName
   * @param {String} val
   * @returns
   */
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

  /**
   * @description returns details of all users
   * @returns
   */
  const getAllUsers = async function () {
    const results = await UserModel.findAll({
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
      order: [["createdAt", "DESC"]],
    });
    return results;
  };

  /**
   * @description updates password of a particular user
   * @param {String} email
   * @param {String} newPassword
   * @returns
   */
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

  const userProfilePictureUpdate = async function (fileInfo) {
    const results = await UserModel.update(
      {
        profile_picture: fileInfo?.filename,
      },
      {
        where: {
          uuid: fileInfo?.uuid,
        },
      }
    );
    return results ? true : false;
  };

  /**
   * @description remove user record from database
   * @param {String} uuid
   * @returns
   */
  const removeUser = async function (uuid) {
    const results = await UserModel.destroy({
      where: {
        uuid,
      },
    });
    return results ? true : false;
  };

  /**
   * @description searches string against user details
   * @param {String} searchString
   * @param {Number} offset
   * @param {Number} limit
   * @returns
   */
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

  /**
   * @description verfies user
   * @param {String} uuidhash
   * @returns
   */
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
    userProfilePictureUpdate,
  };
};

const PersistentTokensQueries = function () {
  /**
   * @param {String} token
   * @param {String} publicKey
   * @param {String} uuid
   * @returns
   */
  const addNewUserToken = async function (token, publicKey, uuid) {
    const results = await PersistentTokensModel.create({
      uuid: uuid,
      jwt: token,
      publicKey: publicKey,
    });
    return results;
  };

  /**
   * @description checks existance of user
   * @param {String} columnName
   * @param {String} val
   * @returns
   */
  const checkUserExistance = async function (columnName, val) {
    const results = await PersistentTokensModel.findOne({
      where: {
        [columnName]: val,
      },
    });
    return results;
  };

  /**
   * @param {String} jwt
   * @returns
   */
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

  /**
   * @description remove jwt token record from database
   * @param {String} jwt
   * @returns
   */
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
