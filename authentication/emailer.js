var nodemailer = require('nodemailer');
//var senderEmailId = 'aptmaint@eastgate.in';
//var senderPass = '@100@rng';
var tempEmailId = 'mohankumar.anna@outlook.com';
//var host = 'smtp.zoho.com';
//var port = 465;
//var secure = true;

function sendMailTo(emailId, template){
  if(! process.env.host) {
    console.log('No email-host available!');
    return null;
  }

  let transporter = nodemailer.createTransport({
    host: process.env.host,
    port: +process.env.port, // + used here to convert string into integer
    secure: process.env.secure,
    auth: {
      user: process.env.senderEmailId,
      pass: process.env.senderPass
    }
  });

  let mailOptions = {
    from: process.env.senderEmailId,
    // to: emailId
    to: tempEmailId,
    subject: template.subject,
    text: template.body,
    html: template.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    (error)
    ? console.log(error)
    : console.log('Message %s ; Send stauts: %s', info.messageId, info.response);
  });

}

module.exports = { sendMailTo };
