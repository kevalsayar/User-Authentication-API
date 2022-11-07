const express = require("express");
const bodyParser = require("body-parser");
const { PORT } = require("./env");
const indexRouter = require("./api/index");

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Server's listening on port ${PORT}....`);
});
