const i18nInit = {
  fallbackLng: "en",
  backend: {
    loadPath: "./locales/{{lng}}/translation.json",
  },
  objectNotation: true,
};

module.exports = { i18nInit };
