const { createHmac, generateKeyPair } = require("crypto"),
  fs = require("fs"),
  { promisify } = require("util"),
  readFileAsync = promisify(fs.readFile),
  path = require("path"),
  jwt = require("jsonwebtoken"),
  Handlebars = require("handlebars"),
  { REQUEST_CODE, STATUS, Messages } = require("./members"),
  { SECRET_KEY, PASS_ENCRYPTION, ALGORITHM, EXPIRES_IN } = require("../../env"),
  { logger } = require("../config/logger.config"),
  { options } = require("./utils"),
  { mailTransporter } = require("../config/mail.config");

const HelperFunction = function () {
  /**
   * @description create response payload
   * @param { 400 | 401 | 500 | 200 | 201} code - defines response's code
   * @param { boolean } status - defines request's success or failure
   * @param { string } message - defines message
   * @param { string } data - an optional parameter to pass data
   * @returns
   */
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
        if (err) logger.error(err.message)(err);
        logger.info("Done Writing!");
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

  /**
   * @description generates hash of provided string
   * @param {Object} data
   * @returns
   */
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
            const token = jwt.sign(data, privateKey, options);
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

  /**
   * @description verify jwt token
   * @param {String} token
   * @param {String} publicKey
   * @returns
   */
  const verifyToken = function (token, publicKey) {
    try {
      jwt.verify(token, publicKey, options);
      return true;
    } catch (error) {
      logger.error(error.message);
      return false;
    }
  };

  /**
   * @description send email
   * @param {Object} mailDetails
   * @param {string} templateName
   * @param {Object} data
   */
  const sendEmail = async function (mailDetails, templateName, data) {
    const html = await getTemplate(templateName, data);
    mailDetails.html = html;
    try {
      mailTransporter.sendMail(mailDetails, function (err, result) {
        if (!err) logger.info(`Email sent successfully to ${data.name}`);
      });
    } catch (error) {
      logger.error(error.message);
    }
  };

  /**
   * @description get template to send in email
   * @param { string } templateName
   * @param { Object } data
   * @returns
   */
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
            logger.error(err.message);
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
