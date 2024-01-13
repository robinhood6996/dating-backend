const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "incontriesc.com",
  auth: {
    user: "admin@incontriesc.com",
    pass: "7pTvH@&uS814EP*#n3*Yf@xC",
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

exports.sendEmail = (receiver, subject, text, html) => {
  const sender = process.env.ADMIN_MAIL_SENDER;
  const mailOptions = mailOption(sender, receiver, subject, text, html);
  console.log("mailOptions", mailOptions);
  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
    return "Email sent";
  });
};
