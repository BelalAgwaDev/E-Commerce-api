const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) create transporter

  //nodemailer.createTransport({
  //     host: process.env.EMAIL_HOST,
  //     port: process.env.EMAIL_PORT,
  //     secure: true, // false for 587, true for other ports
  //     auth: {
  //       user: process.env.EMAIL_USER, // generated ethereal user
  //       pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  //     },
  //   });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // Your full email address
      user: "belalagwa100@gmail.com",
      // Your Gmail password or App Password
      pass: "belal agwa100",
    },
  });

  // 2) define email options
  const emailOption = {
    from: '"E_shop app" <belalagwa0.com>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  //3) send email

  await transporter.sendMail(emailOption);
};

module.exports = sendEmail;
