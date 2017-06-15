var nodemailer = require('nodemailer');
var senderEmailId = 'admin@eastgate.in';
var senderPass = '@Mohan12345@';
var recipientEmailId = 'mohankumar.anna@outlook.com';
var host = 'smtp.zoho.com';
var port = 465;
var secure = true;

function sendMailTo(emailId, template){

  let transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure,
    auth: {
      user: senderEmailId,
      pass: senderPass
    }
  });

  let mailOptions = {
    from: senderEmailId,
    to: recipientEmailId,
    subject: template.subject,
    text: template.body,
    html: template.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    error ? console.log(error) : console.log('Message %s send: %s', info.messageId, info.response);
  });

}

module.exports = { sendMailTo };
