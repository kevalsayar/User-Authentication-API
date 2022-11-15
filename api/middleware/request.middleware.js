const { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members");

const requestMiddleware = function () {
  const validateReqBody = function (reqSchema) {
    return (req, res, next) => {
      if (req.body) {
        const { error } = reqSchema.validate(req.body);
        if (error) {
          const response = HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            error.message
          );
          res.status(response.code).json(response);
        } else next();
      } else {
        const response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.request.validation["body-not-exist"]
        );
        res.status(response.code).json(response);
      }
    };
  };

  const validateQueryParam = function (queryParamSchema) {
    return (req, res, next) => {
      if (req.query.page_num && req.query.record_limit) {
        const { error } = queryParamSchema.validate(req.query);
        if (error) {
          const response = HelperFunction.showResponse(
            ConstantMembers.REQUEST_CODE.BAD_REQUEST,
            ConstantMembers.STATUS.FALSE,
            error.message
          );
          res.status(response.code).json(response);
        } else next();
      } else {
        response = HelperFunction.showResponse(
          ConstantMembers.REQUEST_CODE.BAD_REQUEST,
          ConstantMembers.STATUS.FALSE,
          ConstantMembers.Messages.data.queryparams
        );
        res.status(response.code).json(response);
      }
    };
  };

  return {
    validateReqBody,
    validateQueryParam,
  };
};

module.exports = {
  reqMiddleware: requestMiddleware(),
};
