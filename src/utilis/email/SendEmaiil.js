const nodemailer = require('nodemailer');
// const handlebars = require('handlebars');
// const fs = require('fs');
// const path = require('path');

const sendEmail = async ({ to, subject, otp }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "esthemates@gmail.com",
        pass: "ytao qodz favq lttf",
        }
    });

    const options = {
      from: 'esthemates@gmail.com',
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
