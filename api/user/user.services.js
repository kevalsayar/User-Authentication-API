const { HelperFunction } = require("../common/helper"),
  { UserModel, PersistentTokenModel } = require("./user.queries"),
  { ConstantMembers } = require("../common/members"),
  { em } = require("../pubsub/index"),
  { v4: uuidv4 } = require("uuid"),
  { logger } = require("../config/logger.config");

const UserServices = function () {
  const register = async function (userInfo) {
    const { email } = userInfo;
    if (await UserModel.checkUserExistance("email", email)) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.user["user-exists"]
      );
    } else {
      userInfo.password = HelperFunction.generateHash(userInfo.password);
      const useruuid = uuidv4();
      userInfo.uuid = useruuid;
      userInfo.uuidhash = HelperFunction.generateHash(useruuid);
      const results = await UserModel.createUser(userInfo);
      if (results) {
        em.emit("register", results);
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.ENTRY_ADDED,
          ConstantMembers.STATUS.TRUE,
          ConstantMembers.Messages.user["user-registered"]
        );
      }
    }
  };

  const userDetails = async function (userInfo) {
    const { uuid } = userInfo;
    if (uuid) {
      const isExist = await UserModel.getSingleUser("uuid", uuid);
      if (!isExist) {
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.user["uuid-does-not-exist"]
        );
      } else {
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.SUCCESS,
          ConstantMembers.STATUS.TRUE,
          ConstantMembers.Messages.data.success,
          isExist
        );
      }
    } else {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.data.success,
        await UserModel.getAllUsers()
      );
    }
  };

  const passwordUpdate = async function (userInfo) {
    const { email, password } = userInfo;
    const isExist = await UserModel.checkUserExistance("email", email);
    if (!isExist) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.user["no-user-found"]
      );
    }
    const result = await UserModel.userPassUpdate(
      email,
      HelperFunction.generateHash(password)
    );
    if (result) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.user["password-update-success"]
      );
    }
  };

  const login = async function (userInfo) {
    const { email, password } = userInfo;
    const isExist = await UserModel.checkUserExistance("email", email);
    if (!isExist) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.user["no-user-found"]
      );
    }
    const verified = await UserModel.userVerificationStatus("email", email);
    if (verified) {
      const isLoggedIn = await PersistentTokenModel.checkUserExistance(
        "uuid",
        isExist.dataValues.uuid
      );
      if (!isLoggedIn) {
        if (
          isExist.dataValues["password"] ===
          HelperFunction.generateHash(password)
        ) {
          const { token, publicKey } = await HelperFunction.signAndGet({
            id: isExist.dataValues.id,
          });
          const result = await PersistentTokenModel.addNewUserToken(
            token,
            publicKey,
            isExist.dataValues.uuid
          );
          if (result) {
            return HelperFunction.showResponse(
              ConstantMembers.REQUEST_CODE.SUCCESS,
              ConstantMembers.STATUS.TRUE,
              ConstantMembers.Messages.user["login-success"],
              { token }
            );
          }
        } else {
          return HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.user["wrong-password"]
          );
        }
      } else {
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.user["login-error"]
        );
      }
    }
    return HelperFunction.showResponse(
      ConstantMembers.REQUEST_CODE.BAD_REQUEST,
      ConstantMembers.STATUS.FALSE,
      ConstantMembers.Messages.user["user-not-verified"]
    );
  };

  const logout = async function (jwt) {
    if (await PersistentTokenModel.removeToken(jwt))
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.user["logout-success"]
      );
    return HelperFunction.showResponse(
      ConstantMembers.REQUEST_CODE.BAD_REQUEST,
      ConstantMembers.STATUS.FALSE,
      ConstantMembers.Messages.user["logout-error"]
    );
  };

  const removeUserFromDB = async function (userInfo) {
    const { uuid } = userInfo;
    if (!(await UserModel.checkUserExistance("uuid", uuid))) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.user["no-user-found"]
      );
    }
    if (await UserModel.removeUser(uuid))
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.user["user-delete-success"]
      );
    return HelperFunction.showResponse(
      ConstantMembers.REQUEST_CODE.BAD_REQUEST,
      ConstantMembers.STATUS.FALSE,
      ConstantMembers.Messages.user["user-delete-error"]
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
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          "Record not found"
        );
      const total_pages = Math.ceil(
        parseInt(searchResult.count) / parseInt(data.record_limit)
      );
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.SUCCESS,
        ConstantMembers.STATUS.TRUE,
        "Search result",
        {
          total_pages: total_pages,
          total_records: searchResult.count,
          search_list: searchResult.rows,
        }
      );
    } catch (error) {
      logger.error(error.message);
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.INTERNAL_SERVER_ERROR,
        false,
        error.message
      );
    }
  };

  const verifyUser = async function (userInfo) {
    const { uuidhash } = userInfo;
    const isExist = await UserModel.checkUserExistance("uuidhash", uuidhash);
    if (!isExist) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.BAD_REQUEST,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.user["no-user-found"]
      );
    }
    const verified = await UserModel.userVerificationStatus(
      "uuidhash",
      uuidhash
    );
    if (!verified) {
      const result = await UserModel.userVerificationUpdate(uuidhash);
      if (result) {
        return HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.SUCCESS,
          ConstantMembers.STATUS.TRUE,
          ConstantMembers.Messages.user["user-verification-done"]
        );
      }
    }
    return HelperFunction.showResponse(
      ConstantMembers.REQUEST_CODE.SUCCESS,
      ConstantMembers.STATUS.TRUE,
      ConstantMembers.Messages.user["user-already-verified"]
    );
  };

  const uploadImage = async function (userInfo) {
    const result = await UserModel.userProfilePictureUpdate(userInfo);
    if (result) {
      return HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.ENTRY_ADDED,
        ConstantMembers.STATUS.TRUE,
        ConstantMembers.Messages.image["image-uploaded"]
      );
    }
  };

  return {
    register,
    userDetails,
    passwordUpdate,
    login,
    logout,
    removeUserFromDB,
    searchInfoOfDeal,
    verifyUser,
    uploadImage,
  };
};

module.exports = {
  UserService: UserServices(),
};
