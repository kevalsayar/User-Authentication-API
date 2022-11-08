const joi = require("joi");

const name = joi.string().label("Name");
const age = joi.string().label("Age");
const company = joi.string().label("Company");
const email = joi.string().email().label("Email Address");
const password = joi.string().label("Password");
const number = joi.number().label("Number");

const registerUserSchema = joi.object({
  name: name.required(),
  age: age.required(),
  company: company.required(),
  email: email.required(),
  password: password.required(),
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
};
