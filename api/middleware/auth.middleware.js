const { PersistentTokenModel } = require("../user/user.queries"),
  { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members");

const authMiddleware = function () {
  /**
   * @description checks if bearer token exists or not
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  const auth = async function (req, res, next) {
    if (req.headers.authorization) {
      const jwtToken = req.headers.authorization;
      if (jwtToken.includes("Bearer")) {
        const persistentToken = await PersistentTokenModel.getPublicKey(
          jwtToken.split(" ")[1]
        );
        if (persistentToken) {
          if (
            HelperFunction.verifyToken(
              persistentToken.jwt,
              persistentToken.publicKey
            )
          ) {
            next();
          } else {
            if (PersistentTokenModel.removeToken(persistentToken.jwt)) {
              const response = HelperFunction.showResponse(
                ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
                ConstantMembers.STATUS.FALSE,
                ConstantMembers.Messages.token["token-expired"]
              );
              res
                .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
                .json(await HelperFunction.specificLangData(response, req.t));
            }
          }
        } else {
          const response = HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.token["token-not-found"]
          );
          res
            .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
            .json(await HelperFunction.specificLangData(response, req.t));
        }
      } else {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.token["bearer-token-required"]
        );
        res
          .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
          .json(await HelperFunction.specificLangData(response, req.t));
      }
    } else {
      const response = HelperFunction.showResponse(
        ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
        ConstantMembers.STATUS.FALSE,
        ConstantMembers.Messages.token["token-not-provided"]
      );
      res
        .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
        .json(await HelperFunction.specificLangData(response, req.t));
    }
  };

  return {
    auth,
  };
};

module.exports = {
  authMiddleware: authMiddleware(),
};
