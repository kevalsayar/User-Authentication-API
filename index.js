const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.json());
  
const indexRouter = require("./api/index");
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000....");
});
