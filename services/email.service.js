const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: process.env.MAIL_HOST,
  auth: {
    user:process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  secure: true,
});
/* istanbul ignore next */
if (process.env.ENV !== "live") {
  transport
    .verify()
    .then(() => console.log("Connected to email server"))
    .catch(() =>
     console.error(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html='') => {
  const msg = { from: process.env.MAIL_USER , to, subject, text, html };
  try{
    await transport.sendMail(msg);
    return 'Email sent'
  }catch(error){
    console.log(error)
  }
  
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendPasswordForPwChange = async (to) => {
  const subject = 'Your password has been changed'
  const text = `Dear user,
Your password is changed to incontriesc.com
If you did not request any password change, then report to admin`;
  await sendEmail(to, subject, text);
};
const sendWelcomeMessageToOwnerForEscort = async (to, userName) => {
  const subject = "You got a new escort on your site";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://incontriesc.com/escort/profile/${userName}/overview`;
  const text = `Dear admin,
You got a new Escort on Incontriesc, Login to admin panel to see who registered on your site.
`;
  await sendEmail(to, subject, text);
};
const sendWelcomeMessageToOwnerForUser = async (to, userName) => {
  const subject = "You got a new user on your site";
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `https://incontriesc.com/escort/profile/${userName}/overview`;
  const text = `Dear admin,
You got a new User on Incontriesc, Login to admin panel to see who registered on your site.
`;
  await sendEmail(to, subject, text);
};
const sendWelcomeMessageToUser = async (to) => {
  const subject = "Welcome to Incontriesc";
  const text = `Dear user,
Thanks for creating account with incontriesc.com
Hope your journey with us will be Good and Smooth`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = "Email Verification";
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
 sendWelcomeMessageToOwnerForEscort,
 sendWelcomeMessageToOwnerForUser,
 sendWelcomeMessageToUser,
 sendPasswordForPwChange
};
