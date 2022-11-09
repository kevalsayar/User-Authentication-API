const { verifyToken } = require("../common/helper");
const { PersistentTokenModel } = require("../user/user.queries");
const { showResponse } = require("../common/helper");
const { REQUEST_CODE, STATUS, Messages } = require("../common/members");

const auth = async function (req, res, next) {
  if (req.headers.authorization) {
    const jwtToken = req.headers.authorization;
    if (jwtToken.includes("Bearer")) {
      const persistentToken = await PersistentTokenModel.getPublicKey(
        jwtToken.split(" ")[1]
      );
      if (persistentToken) {
        verifyToken(persistentToken.jwt, persistentToken.publicKey);
        next();
      } else {
        res.send(
          showResponse(
            REQUEST_CODE.BAD_REQUEST,
            STATUS.FALSE,
            Messages.token["token-not-found"]
          )
        );
      }
    } else {
      res.send(
        showResponse(
          REQUEST_CODE.BAD_REQUEST,
          STATUS.FALSE,
          Messages.token["bearer-token-required"]
        )
      );
    }
  } else {
    res.send(
      showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.token["token-not-provided"]
      )
    );
  }
};

module.exports = {
  auth,
};
