const express = require("express"),
  bodyParser = require("body-parser"),
  { PORT } = require("./env"),
  indexRouter = require("./api/index"),
  cors = require("cors"),
  { serve, setup } = require("swagger-ui-express"),
  swaggerDoc = require("./openapi.json"),
  { logger } = require("./api/config/logger.config"),
  app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.use(express.json());

app.use(
  "/apidocs",
  serve,
  setup(swaggerDoc, {
    swaggerOptions: { filter: "", persistAuthorization: true },
    customSiteTitle: "User Authentication Swagger",
  })
);

app.use("/api/v1", indexRouter);

app.listen(PORT, () => {
  logger.info(`Server's listening on port ${PORT}....`);
});
