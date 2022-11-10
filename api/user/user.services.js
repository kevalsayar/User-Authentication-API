const { showResponse, generateHash, signAndGet } = require("../common/helper");
const { UserModel, PersistentTokenModel } = require("./user.queries");
const { REQUEST_CODE, Messages, STATUS } = require("../common/members");
const { em } = require("../pubsub/index");

const register = async function (userInfo) {
  const { email } = userInfo;
  if (await UserModel.checkUserExistance("email", email)) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["user-exists"]
    );
  } else {
    userInfo.password = generateHash(userInfo.password);
    const results = await UserModel.createUser(userInfo);
    if (results) {
      em.emit("register", results);
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.user["user-registered"]
      );
    }
  }
};

const userDetails = async function (userInfo) {
  const { uuid } = userInfo;
  if (uuid) {
    const isExist = await UserModel.getSingleUser("uuid", uuid);
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
  const isExist = await UserModel.checkUserExistance("email", email);
  if (!isExist) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["no-user-found"]
    );
  }
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
  const verified = await UserModel.userVerificationStatus("email", email);
  if (verified) {
    const isLoggedIn = await PersistentTokenModel.checkUserExistance(
      "uuid",
      isExist.dataValues.uuid
    );
    if (!isLoggedIn) {
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
    } else {
      return showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["login-error"]
      );
    }
  }
  return showResponse(
    REQUEST_CODE.BAD_REQUEST,
    STATUS.FALSE,
    Messages.user["user-not-verified"]
  );
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
  if (!(await UserModel.checkUserExistance("uuid", uuid))) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["no-user-found"]
      )
    );
  }
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

const searchInfoOfDeal = async function (data) {
  try {
    const searchResult = await UserModel.searchInfo(
      data.searchValue,
      parseInt(data.record_limit * (data.page_num - 1)),
      parseInt(data.record_limit)
    );
    if (searchResult.count == 0)
      return showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        "Record not found"
      );
    const total_pages = Math.ceil(
      parseInt(searchResult.count) / parseInt(data.record_limit)
    );
    return showResponse(REQUEST_CODE.SUCCESS, STATUS.TRUE, "Search result", {
      total_pages: total_pages,
      total_records: searchResult.count,
      search_list: searchResult.rows,
    });
  } catch (error) {
    return showResponse(
      REQUEST_CODE.INTERNAL_SERVER_ERROR,
      false,
      error.message
    );
  }
};

const verifyUser = async function (userInfo) {
  const { uuidhash } = userInfo;
  const isExist = await UserModel.checkUserExistance("uuidhash", uuidhash);
  if (!isExist) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["no-user-found"]
    );
  }
  const verified = await UserModel.userVerificationStatus("uuidhash", uuidhash);
  if (!verified) {
    const result = await UserModel.userVerificationUpdate(uuidhash);
    if (result) {
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.user["user-verification-done"]
      );
    }
  }
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.user["user-already-verified"]
  );
};

module.exports = {
  register,
  userDetails,
  passwordUpdate,
  login,
  logout,
  removeUserFromDB,
  searchInfoOfDeal,
  verifyUser,
};
