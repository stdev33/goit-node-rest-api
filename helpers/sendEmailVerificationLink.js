import sendEmail from "./sendEmail.js";
import "dotenv/config";

const { SERVER_HOST = "localhost", SERVER_PORT = 3000 } = process.env;

const sendEmailVerificationLink = async (email, verificationToken) => {
  const msg = {
    to: email,
    subject: "Email verification",
    html: `<a target="_blank" href="http://${SERVER_HOST}:${SERVER_PORT}/api/users/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(msg);
};

export default sendEmailVerificationLink;
