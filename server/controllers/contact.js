import { SENDGRID_KEY, EMAIL_FROM } from "../config";

// sendgrid
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(SENDGRID_KEY);

export const contact = async (req, res) => {
  const { name, email, message } = req.body;
  const emailData = {
    from: EMAIL_FROM,
    to: EMAIL_FROM,
    subject: `Message from contact form`,
    html: `<h1>You've been sent a message from ${name}:</h1>
      <h2><u>Email:</u> ${email}</h2>
                <p>${message}</p>`,
  };
  try {
    const data = await sgMail.send(emailData);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.json({ error: err });
  }
};
