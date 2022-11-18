const express = require("express"),
  bodyParser = require("body-parser"),
  { PORT } = require("./env"),
  indexRouter = require("./api/index"),
  cors = require("cors"),
  { serve, setup } = require("swagger-ui-express"),
  swaggerDoc = require("./openapi.json"),
  { logger } = require("./api/config/logger.config"),
  { swaggerOptions } = require("./api/common/utils"),
  i18next = require("i18next"),
  backend = require("i18next-fs-backend"),
  middleware = require("i18next-http-middleware"),
  { i18nInit } = require("./api/config/i18n.config");

i18next.use(backend).use(middleware.LanguageDetector).init(i18nInit);

const app = express();
app.use(middleware.handle(i18next));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use(express.json());

app.use("/apidocs", serve, setup(swaggerDoc, swaggerOptions));

app.use("/api/v1", indexRouter);

app.listen(PORT, () => {
  logger.info(`Server's listening on port ${PORT}....`);
});
