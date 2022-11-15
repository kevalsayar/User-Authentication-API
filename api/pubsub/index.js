const events = require("events"),
  { HelperFunction } = require("../common/helper"),
  { ConstantMembers } = require("../common/members"),
  { mailDetails } = require("../common/utils"),
  em = new events.EventEmitter();

em.on("register", async function (data) {
  mailDetails.to = data.email;
  mailDetails.subject = `Thank you for registering ${data.name}`;
  await HelperFunction.sendEmail(
    mailDetails,
    ConstantMembers.HTML_TEMPLATES.WELCOME,
    data
  );
});

module.exports = { em };
