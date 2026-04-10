import nodemailer from "nodemailer";

const sendMail = (email: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message
  })
  .then(() => console.log("Mail sent"))
  .catch(err => console.log("Mail error:", err));
};

export default sendMail;