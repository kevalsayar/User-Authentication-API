const { ALGORITHM, EXPIRES_IN } = require("../../env");

const options = {
  algorithm: ALGORITHM,
  expiresIn: EXPIRES_IN,
};

module.exports = {
  options,
};
