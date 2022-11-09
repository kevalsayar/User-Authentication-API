const nodemailer = require("nodemailer");
const { MAIL_USER, MAIL_PASS, MAIL_HOST, MAIL_PORT } = require("../../env");

const mailTransporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

module.exports = {
  mailTransporter,
};