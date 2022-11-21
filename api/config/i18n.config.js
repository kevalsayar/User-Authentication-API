/**
 * i18n Configurations
 */
const { LANGUAGES } = require("../../env");

const i18nInit = {
  fallbackLng: "en",
  backend: {
    loadPath: process.cwd() + `${LANGUAGES}/{{lng}}/translation.json`,
  },
  objectNotation: true,
};

module.exports = { i18nInit };
