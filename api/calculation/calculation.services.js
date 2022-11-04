const { showResponse } = require("../common/helper");
const { REQUEST_CODE, Messages, STATUS } = require("../common/members");
const { v4: uuidv4 } = require("uuid");
const { readFile } = require("../common/helper");

const add = function (userInfo) {
  const { first, second } = userInfo;
  if (!first || !second) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.STATUS.FALSE,
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

const getData = async function (info) {
  const { uuid } = info;
  return await readFile(uuid);
};

const addPersonDetails = function (userInfo) {
  const { name, age, company } = userInfo;
  return showResponse(
    REQUEST_CODE.SUCCESS,
    STATUS.TRUE,
    Messages.data.success,
    {
      uuid: uuidv4(),
      name: name,
      age: age,
      company: company,
    }
  );
};

const getUserDetails = async function (userInfo) {
  const data = await readFile("userDetails");
  const { uuid } = userInfo;
  if (uuid) {
    const singleUser = data.data.filter(
      (user) => user.data.uuid === (uuid)
    )
    console.log(singleUser);
    if (singleUser === []) {
      return showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.data.error,
      );
    } else {
      return showResponse(
        REQUEST_CODE.SUCCESS,
        STATUS.TRUE,
        Messages.data.success,
        singleUser[0].data
      );
    }
  } else {
    const arr = [];
    for (data1 in data.data) {
      arr.push(data.data[data1].data);
    }
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.data.success,
      arr
    );
  }
};

module.exports = {
  add,
  multiply,
  subtract,
  divide,
  getData,
  addPersonDetails,
  getUserDetails,
};
