const { UserModel, PersistentTokenModel } = require("../user/user.queries");
const { showResponse } = require("../common/helper");
const { REQUEST_CODE, STATUS, Messages } = require("../common/members");
const url = require("node:url");

const validateReqBody = function (reqSchema) {
  return (req, res, next) => {
    let response;
    if (req.body) {
      const { error } = reqSchema.validate(req.body);
      if (error) {
        response = showResponse(
          REQUEST_CODE.BAD_REQUEST,
          STATUS.FALSE,
          error.message
        );
        res.status(response.code).json(response);
      } else next();
    } else {
      response = showResponse(
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
    const urlInfo = url.parse(req.url);
    if (
      req.query.page_num &&
      req.query.record_limit &&
      urlInfo.pathname == "/search"
    ) {
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
        Messages.data.error
      );
      res.status(response.code).json(response);
    }
  };
};

module.exports = {
  validateReqBody,
  validateQueryParam,
};
