/**
 * i18n Configurations
 */
const { LANGUAGE_PATH } = require("../../env");

const i18nInit = {
  fallbackLng: "en",
  backend: {
    loadPath: process.cwd() + `${LANGUAGE_PATH}/{{lng}}/{{lng}}.json`,
  },
  objectNotation: true,
};

module.exports = { i18nInit };
