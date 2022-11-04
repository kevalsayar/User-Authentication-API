const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { REQUEST_CODE, STATUS, Messages } = require("./members");
const readFileAsync = promisify(fs.readFile);

const showResponse = function (code, status, message, data = null) {
  const response = { code, status, message };
  if (data) response.data = data;
  return response;
};

const writeFile = function (fileName, data) {
  fs.writeFile(
    path.join(__dirname, "..", "userdata", `${fileName}.json`),
    JSON.stringify(data),
    (err) => {
      if (err) console.log(err);
      console.log("Done writing");
    }
  );
};

const readFile = async function (fileName) {
  try {
    const res = await readFileAsync(
      path.join(__dirname, "..", "userdata", `${fileName}.json`),
      "utf-8"
    );
    return showResponse(
      REQUEST_CODE.SUCCESS,
      STATUS.TRUE,
      Messages.data.success,
      JSON.parse(res)
    );
  } catch (error) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.data.error,
    );
  }
};

module.exports = {
  showResponse,
  writeFile,
  readFile,
};
