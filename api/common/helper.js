const { createHmac } = require("crypto");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { REQUEST_CODE, STATUS, Messages } = require("./members");
const readFileAsync = promisify(fs.readFile);
const jwt = require("jsonwebtoken");
const { SECRET_KEY, PASS_ENCRYPTION } = require("../../env");

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
    return JSON.parse(res);
    // return showResponse(
    //   REQUEST_CODE.SUCCESS,
    //   STATUS.TRUE,
    //   Messages.data.success,
    //   JSON.parse(res)
    // );
  } catch (error) {
    return showResponse(
      REQUEST_CODE.BAD_REQUEST,
      STATUS.FALSE,
      Messages.data.error
    );
  }
};

const generateHash = function (data) {
  const hash = createHmac(PASS_ENCRYPTION, SECRET_KEY);
  return hash.update(data).digest("hex");
};

const signAndGet = function (data) {
  return new Promise((resolve, rejects) => {
    crypto.generateKeyPair(
      "dsa",
      {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (!err) {
          const token = jwt.sign(
            data,
            privateKey,
            { algorithm: "ES256" },
            { expiresIn: "60s" }
          );
          resolve({
            publicKey,
            token,
          });
        } else {
          rejects(err);
        }
      }
    );
  });
};

const verifyToken = function (token, publicKey) {
  const payload = jwt.verify(token, publicKey);
  return payload;
};

module.exports = {
  showResponse,
  writeFile,
  readFile,
  generateHash,
  signAndGet,
  verifyToken,
};
