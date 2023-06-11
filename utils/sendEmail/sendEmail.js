const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');


const sendEmail=async (options)=>{
    // 1) create transporter 
     const transporter = 
    //nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     secure: true, // false for 587, true for other ports
    //     auth: {
    //       user: process.env.EMAIL_USER, // generated ethereal user
    //       pass: process.env.EMAIL_PASSWORD, // generated ethereal password
    //     },
    //   });

      nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      }));

      
    // 2) define email options 
    const emailOption ={
     from: '"E_shop app" <belalagwa0.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
     
    }


    //3) send email

  //  await transporter.sendMail(emailOption);

    await   transporter.sendMail(emailOption, (error, info) =>{
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${  info.response}`);
      }
    });
}

module.exports=sendEmail