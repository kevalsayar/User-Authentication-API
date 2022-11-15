const { ALGORITHM, EXPIRES_IN, FROM_MAIL } = require("../../env");

const options = {
    algorithm: ALGORITHM,
    expiresIn: EXPIRES_IN,
  },
  mailDetails = {
    from: FROM_MAIL,
  },
  swaggerOptions = {
    swaggerOptions: { filter: "", persistAuthorization: true },
    customSiteTitle: "User Authentication Swagger",
  };

module.exports = {
  options,
  mailDetails,
  swaggerOptions,
};
