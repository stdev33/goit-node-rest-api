import sgMail from "@sendgrid/mail";
import "dotenv/config";

const { SENDGRID_API_KEY, SENDGRID_SENDER } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmail = (data) => {
  const msg = { ...data, from: SENDGRID_SENDER };
  return sgMail.send(msg);
};

export default sendEmail;
