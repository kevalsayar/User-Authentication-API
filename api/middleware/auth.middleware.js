const { PersistentTokenModel } = require("../user/user.queries"),
  { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members");

const authMiddleware = function () {
  /**
   * @description check bearer token exist or not
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
              res
                .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
                .json(
                  HelperFunction.showResponse(
                    ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
                    ConstantMembers.STATUS.FALSE,
                    ConstantMembers.Messages.token["token-expired"]
                  )
                );
            }
          }
        } else {
          res
            .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
            .json(
              HelperFunction.showResponse(
                ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
                ConstantMembers.STATUS.FALSE,
                ConstantMembers.Messages.token["token-not-found"]
              )
            );
        }
      } else {
        res
          .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
          .json(
            HelperFunction.showResponse(
              ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
              ConstantMembers.STATUS.FALSE,
              ConstantMembers.Messages.token["bearer-token-required"]
            )
          );
      }
    } else {
      res
        .status(ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER)
        .json(
          HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.UNAUTHORIZED_USER,
            ConstantMembers.STATUS.FALSE,
            ConstantMembers.Messages.token["token-not-provided"]
          )
        );
    }
  };

  return {
    auth,
  };
};

module.exports = {
  authMiddleware: authMiddleware(),
};
