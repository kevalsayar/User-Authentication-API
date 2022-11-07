const { v4: uuidv4 } = require("uuid");
const { User, PersistentTokensModel } = require("./calculation.model");

const UserQueries = function () {
  const create = async function (user) {
    const results = await User.create({
      id: uuidv4(),
      name: user?.name,
      age: user?.age,
      email: user?.email,
      password: user?.password,
      company: user?.company,
    });
    return results;
  };

  const checkExistance = async function (columnName, uuid) {
    const results = await User.findOne({
      where: {
        [columnName]: uuid,
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

  return {
    create,
    checkExistance,
    getAllUsers,
  };
};

const PersistentTokensQueries = function () {
  const addNewUserToken = async function (token, publicKey) {
      const results = await PersistentTokensModel.create({
          jwt : token,
          publicKey : publicKey
      });
      return results;
  }

  const getPublicKey = async function (jwt) {
      const results = await PersistentTokensModel.findOne({
          where : {
              jwt
          },
          attributes : ['jwt', 'publicKey']
      });
      return results ? results.dataValues : false;
  }

  const removeToken = async function (jwt) {
      const results = await PersistentTokensModel.destroy({
          where : {
              jwt
          }
      });

      return results ? true : false;
  }

  return {
      addNewUserToken,
      getPublicKey,
      removeToken
  }

} 

module.exports = {
  UserModel: UserQueries(),
  PersistentTokenModel: PersistentTokensQueries()
};
