const nodemailer = require('nodemailer');
// const handlebars = require('handlebars');
// const fs = require('fs');
// const path = require('path');

const sendEmail = async ({ to, subject, otp }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      secure: true,
      secureConnection: false,
      tls: {
        ciphers: 'SSLv3'
      },
      requireTLS: true,
      port: 465,
      debug: true,
      auth: {
        user: "admin@esthemate.com",
        pass: "Estival328!"
      }
    });

    const options = {
      from: 'admin@esthemate.com',
      to: to,
      subject: subject,
      html: `<h1>OTP is : ${otp}</h1>`,
    };

    // Send the email
    await transporter.sendMail(options);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
