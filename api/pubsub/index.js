const events = require("events"),
  { HelperFunction } = require("../common/helper"),
  { HTML_TEMPLATES } = require("../common/members"),
  { FROM_MAIL } = require("../../env"),
  em = new events.EventEmitter(),
  mailDetails = {
    from: FROM_MAIL,
  };

em.on("register", async function (data) {
  mailDetails.to = data.email;
  mailDetails.subject = `Thank you for registering ${data.name}`;
  await HelperFunction.sendEmail(mailDetails, HTML_TEMPLATES.WELCOME, data);
});

module.exports = { em };
