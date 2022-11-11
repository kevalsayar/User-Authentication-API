const { createHmac, generateKeyPair } = require("crypto"),
  fs = require("fs"),
  path = require("path"),
  { promisify } = require("util"),
  { REQUEST_CODE, STATUS, Messages } = require("./members"),
  readFileAsync = promisify(fs.readFile),
  jwt = require("jsonwebtoken"),
  { SECRET_KEY, PASS_ENCRYPTION } = require("../../env"),
  { mailTransporter } = require("../config/mail.config"),
  Handlebars = require("handlebars");

const HelperFunction = function () {
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
      generateKeyPair(
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

  const sendEmail = async function (mailDetails, templateName, data) {
    const html = await getTemplate(templateName, data);
    mailDetails.html = html;
    try {
      mailTransporter.sendMail(mailDetails, function (err, data) {
        if (!err) console.log("Email sent successfully");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getTemplate = async function (templateName, data) {
    return new Promise((resolve, rejects) => {
      fs.readFile(
        path.join(__dirname, "..", "templates", templateName, "index.html"),
        function (err, fileData) {
          if (!err) {
            const template = fileData.toString();
            const HandleBarsFunction = Handlebars.compile(template);
            const html = HandleBarsFunction(data);
            resolve(html);
          } else {
            rejects(err);
          }
        }
      );
    });
  };

  return {
    showResponse,
    writeFile,
    readFile,
    generateHash,
    signAndGet,
    verifyToken,
    sendEmail,
    getTemplate,
  };
};

module.exports = {
  HelperFunction: HelperFunction(),
};
