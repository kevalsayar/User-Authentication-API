const { showResponse, generateHash, signAndGet } = require("../common/helper");
const { UserModel, PersistentTokenModel } = require("./calculation.queries");
const { REQUEST_CODE, Messages, STATUS } = require("../common/members");
const { v4: uuidv4 } = require("uuid");
const { readFile } = require("../common/helper");

const add = function (userInfo) {
  const { first, second } = userInfo;
  if (!first || !second) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.calculate.error["insufficient-numbers"]
    );
  }
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.calculate.success["addition-success"],
    {
      uuid: uuidv4(),
      sum: parseInt(first) + parseInt(second),
    }
  );
};

const multiply = function (userInfo) {
  const { first, second } = userInfo;
  if (!first || !second) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.calculate.error["insufficient-numbers"]
    );
  }
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.calculate.success["multiplication-success"],
    {
      uuid: uuidv4(),
      sum: parseInt(first) * parseInt(second),
    }
  );
};

const subtract = function (userInfo) {
  const { first, second } = userInfo;
  if (!first || !second) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.calculate.error["insufficient-numbers"]
    );
  }
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.calculate.success["subtraction-success"],
    {
      uuid: uuidv4(),
      sum: parseInt(first) - parseInt(second),
    }
  );
};

const divide = function (userInfo) {
  const { first, second } = userInfo;
  if (!first || !second) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.calculate.error["insufficient-numbers"]
    );
  }
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.calculate.success["division-success"],
    {
      uuid: uuidv4(),
      sum: parseInt(first) / parseInt(second),
    }
  );
};

const addUser = async function (userInfo) {
  const { name, age, company, password, email } = userInfo;
  const isExist = await UserModel.checkExistance("email", email);
  if (!isExist) {
    userInfo.password = generateHash(userInfo.password);
    await UserModel.create(userInfo);
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
  } else {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["user-exists"]
    );
  }
};

const getUserDetails = async function (userInfo) {
  const { uuid } = userInfo;
  if (uuid) {
    const isExist = await UserModel.checkExistance("id", uuid);
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

const confirmCreds = async function (userInfo) {
  const { email, password } = userInfo;
  // Validate user input
  if (!(email && password)) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["email-password-both-necessary"]
    );
  }
  const isExist = await UserModel.checkExistance("email", email);
  if (!isExist) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["no-user-found"]
    );
  } else if (isExist.dataValues["password"] === generateHash(password)) {
    const { token, publicKey } = await signAndGet({
      id: isExist.dataValues.id,
    });
    const result = await PersistentTokenModel.addNewUserToken(token, publicKey);
    if (result){
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.user["login-success"],
        {token}
      );
    }
    
  } else if (isExist.dataValues["password"] !== generateHash(password)) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.user["wrong-password"]
    );
  }
};

module.exports = {
  add,
  multiply,
  subtract,
  divide,
  addUser,
  getUserDetails,
  confirmCreds,
};
