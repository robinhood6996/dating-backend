const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "mail.brightbraininfotech.com",
  auth: {
    user: "hello@brightbraininfotech.com",
    pass: "Hello@bbit",
  },
  secure: true,
});

function mailOption(
  from,
  to,
  subject = "",
  text = "",
  html = "",
  attachments = []
) {
  const email = {
    from,
    to,
    subject,
    text,
  };
  if (html) {
    email.html = html;
  }
  if (attachments) {
    email.attachments = [...attachments];
  }
  return email;
}

exports.sendEmail = async (receiver, subject, text, html) => {
  const sender = process.env.ADMIN_MAIL_SENDER;
  const mailOptions = mailOption(sender, receiver, subject, text, html);
  console.log("mailOptions", mailOptions);
  await emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return "Email sent";
  });
};
