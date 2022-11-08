const { showResponse } = require("../common/helper");
const { REQUEST_CODE, STATUS, Messages } = require("../common/members");
const { UserModel, PersistentTokenModel } = require("../user/user.queries");

const passUpdateCheck = async function (req, res, next) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["email-password-both-necessary"]
      )
    );
  }
  const isExist = await UserModel.checkUserExistance("email", email);
  if (!isExist) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["no-user-found"]
      )
    );
  }
  next();
};

const loginCheck = async function (req, res, next) {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["email-password-both-necessary"]
      )
    );
  }
  next();
};

const deleteUserCheck = async function (req, res, next) {
  const { uuid } = req.body;
  if (!uuid) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["uuid-necessary"]
      )
    );
  }
  if (!(await UserModel.checkUserExistance("uuid", uuid))) {
    return res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.user["no-user-found"]
      )
    );
  }
  next();
};

module.exports = {
  passUpdateCheck,
  loginCheck,
  deleteUserCheck,
};
