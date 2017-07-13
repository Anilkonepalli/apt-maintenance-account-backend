var nodemailer = require('nodemailer');

function sendMailTo(emailId, template){
  if( process.env.can_send_email !== 'true' ) {
    logger.log('debug', 'Sending Email is not Enabled!');
    return null;
  }
  if( !process.env.host ) {
    logger.log('debug', 'No email-host available!');
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
    to: emailId,
    //to: tempEmailId,
    subject: template.subject,
    text: template.body,
    html: template.html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    (error)
    ? logger.log('error', error)
    : logger.log('debug', 'Message %s; Send status: %s.', info.messageId, info.response);
  });

}

module.exports = { sendMailTo };
