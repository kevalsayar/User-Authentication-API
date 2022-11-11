const joi = require("joi"),
  uuid = joi.string().label("UUID"),
  name = joi.string().label("Name"),
  age = joi.number().min(1).label("Age"),
  company = joi.string().label("Company"),
  email = joi.string().email().label("Email Address"),
  password = joi.string().label("Password"),
  number = joi.number().min(1).label("Number");

const valSchemas = function () {
  const registerUserSchema = joi.object({
    name: name.required(),
    age: age.required(),
    company: company.required(),
    email: email.required(),
    password: password.required(),
  });

  const loginUserSchema = joi.object({
    email: email.required(),
    password: password.required(),
  });

  const deleteUserSchema = joi.object({
    uuid: uuid.required(),
  });

  const paginationParams = joi.object({
    page_num: number.optional(),
    record_limit: number.optional(),
  });

  const searchReqSchema = joi.object({
    searchValue: joi.string().required().label("Search value"),
  });

  return {
    registerUserSchema,
    loginUserSchema,
    deleteUserSchema,
    paginationParams,
    searchReqSchema,
  };
};

module.exports = {
  validationSchemas: valSchemas(),
};
