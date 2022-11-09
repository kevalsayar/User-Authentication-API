const events = require("events");
const { sendEmail } = require("../common/helper");
const { HTML_TEMPLATES } = require("../common/members");
const { FROM_MAIL } = require("../../env");
const em = new events.EventEmitter();

const mailDetails = {
  from: FROM_MAIL,
};

em.on("register", async function (data) {
  mailDetails.to = data.email;
  mailDetails.subject = `Thank you for registering ${data.name}`;
  await sendEmail(mailDetails, HTML_TEMPLATES.WELCOME, data);
});

module.exports = { em };
