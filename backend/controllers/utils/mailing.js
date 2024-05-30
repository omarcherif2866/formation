// mailing.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: "comar2866@gmail.com",
    pass: "Omar123??"
  }
});

const sendEmail = (to, subject, text, filePath, from) => {
  const mailOptions = {
    from: from, // Use the sender's email
    to: to,
    subject: subject,
    text: text,
    attachments: [
      {
        path: filePath
      }
    ]
  };

  return transporter.sendMail(mailOptions);
};

export { sendEmail };
