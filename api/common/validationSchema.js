const joi = require("joi");
const uuid = joi.string().label("UUID");
const name = joi.string().label("Name");
const age = joi.number().min(1).label("Age");
const company = joi.string().label("Company");
const email = joi.string().email().label("Email Address");
const password = joi.string().label("Password");
const number = joi.number().min(1).label("Number");

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

module.exports = {
  registerUserSchema,
  paginationParams,
  searchReqSchema,
  loginUserSchema,
  deleteUserSchema,
};
