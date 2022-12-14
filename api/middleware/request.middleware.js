const { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members"),
  { logger } = require("../config/logger.config"),
  { UserModel } = require("../user/user.queries");

const requestMiddleware = function () {
  /**
   * @description validates request body
   * @param {Joi.Schema} reqSchema
   * @returns
   */
  const validateReqBody = function (reqSchema) {
    return async (req, res, next) => {
      if (req.body) {
        const { error } = reqSchema.validate(req.body);
        if (error) {
          const response = HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            error.message
          );
          res
            .status(response.code)
            .json(await HelperFunction.specificLangData(response, req.t));
        } else next();
      } else {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.request.validation["body-not-exist"]
        );
        res
          .status(response.code)
          .json(await HelperFunction.specificLangData(response, req.t));
      }
    };
  };

  /**
   * @description validates query param
   * @param {Joi.Schema} queryParamSchema
   * @returns
   */
  const validateQueryParam = function (queryParamSchema) {
    return async (req, res, next) => {
      if (req.query.page_num && req.query.record_limit) {
        const { error } = queryParamSchema.validate(req.query);
        if (error) {
          const response = HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            error.message
          );
          res
            .status(response.code)
            .json(await HelperFunction.specificLangData(response, req.t));
        } else next();
      } else {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.data.queryparams
        );
        res
          .status(response.code)
          .json(await HelperFunction.specificLangData(response, req.t));
      }
    };
  };

  const checkImageExists = async (req, res, next) => {
    try {
      if (!req.file) {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.image["image-not-uploaded"]
        );
        return res
          .status(response.code)
          .json(await HelperFunction.specificLangData(response, req.t));
      } else {
        next();
      }
    } catch (error) {
      logger.error(error.message);
    }
  };

  const checkUserExists = async (req, res, next) => {
    if (req.params.uuid) {
      const isExist = await UserModel.checkUserExistance(
        "uuid",
        req.params.uuid
      );
      if (!isExist) {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.user["uuid-does-not-exist"]
        );
        return res
          .status(response.code)
          .json(await HelperFunction.specificLangData(response, req.t));
      }
      next();
    }
  };

  return {
    validateReqBody,
    validateQueryParam,
    checkImageExists,
    checkUserExists,
  };
};

module.exports = {
  reqMiddleware: requestMiddleware(),
};
