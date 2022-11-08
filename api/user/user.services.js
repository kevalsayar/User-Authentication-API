const { showResponse, generateHash, signAndGet } = require("../common/helper");
const { UserModel, PersistentTokenModel } = require("./user.queries");
const { REQUEST_CODE, Messages, STATUS } = require("../common/members");

const register = async function (userInfo) {
  const { name, age, company, password, email } = userInfo;
  userInfo.password = generateHash(userInfo.password);
  if (await UserModel.createUser(userInfo)) {
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.data.success,
      {
        name: name,
        age: age,
        company: company,
        email: email,
        password: password,
      }
    );
  }
};

const userDetails = async function (userInfo) {
  const { uuid } = userInfo;
  if (uuid) {
    const isExist = await UserModel.checkUserExistance("uuid", uuid);
    if (!isExist) {
      return showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["uuid-does-not-exist"]
      );
    } else {
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.data.success,
        isExist
      );
    }
  } else {
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.data.success,
      await UserModel.getAllUsers()
    );
  }
};

const passwordUpdate = async function (userInfo) {
  const { email, password } = userInfo;
  const result = await UserModel.userPassUpdate(email, generateHash(password));
  if (result) {
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.user["password-update-success"]
    );
  }
};

const login = async function (userInfo) {
  const { email, password } = userInfo;
  const isExist = await UserModel.checkUserExistance("email", email);
  if (!isExist) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["no-user-found"]
    );
  }
  if (isExist.dataValues["password"] === generateHash(password)) {
    const { token, publicKey } = await signAndGet({
      id: isExist.dataValues.id,
    });
    const result = await PersistentTokenModel.addNewUserToken(
      token,
      publicKey,
      isExist.dataValues.uuid
    );
    if (result) {
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.user["login-success"],
        { token }
      );
    }
  } else {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["wrong-password"]
    );
  }
};

const logout = async function (jwt) {
  if (await PersistentTokenModel.removeToken(jwt))
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.user["logout-success"]
    );
  return showResponse(
    REQUEST_CODE.BAD_REQUEST,
    STATUS.FALSE,
    Messages.user["logout-error"]
  );
};

const removeUserFromDB = async function (userInfo) {
  const { uuid } = userInfo;
  if (await UserModel.removeUser(uuid))
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.user["user-delete-success"]
    );
  return showResponse(
    REQUEST_CODE.BAD_REQUEST,
    STATUS.FALSE,
    Messages.user["user-delete-error"]
  );
};

module.exports = {
  register,
  userDetails,
  passwordUpdate,
  login,
  logout,
  removeUserFromDB,
};
