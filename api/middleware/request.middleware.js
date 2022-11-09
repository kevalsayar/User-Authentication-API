const { showResponse } = require("../common/helper");
const { REQUEST_CODE, STATUS, Messages } = require("../common/members");

const validateReqBody = function (reqSchema) {
  return (req, res, next) => {
    if (req.body) {
      const { error } = reqSchema.validate(req.body);
      if (error) {
        const response = showResponse(
          REQUEST_CODE.BAD_REQUEST,
          STATUS.FALSE,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else {
      const response = showResponse(
        REQUEST_CODE.BAD_REQUEST,
        false,
        Messages.request.validation["body-not-exist"]
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
        const response = showResponse(
          REQUEST_CODE.BAD_REQUEST,
          STATUS.FALSE,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else {
      response = showResponse(
        REQUEST_CODE.BAD_REQUEST,
        STATUS.FALSE,
        Messages.data.queryparams
      );
      res.status(response.code).json(response);
    }
  };
};

module.exports = {
  validateReqBody,
  validateQueryParam,
};
