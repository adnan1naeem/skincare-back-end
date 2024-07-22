const nodemailer = require('nodemailer');
// const handlebars = require('handlebars');
// const fs = require('fs');
// const path = require('path');

const sendEmail = async ({ to, subject, otp }) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "hr@techtiz.co",
        pass: "aitc qooa myjt lcwf",
      },
    });

    // Read the HTML template file
    // const source = fs.readFileSync(path.join(__dirname, template), 'utf8');
    // Compile the template using Handlebars
    // const compiledTemplate = handlebars.compile(source);
    const options = {
      from: 'hr@techtiz.co',
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
