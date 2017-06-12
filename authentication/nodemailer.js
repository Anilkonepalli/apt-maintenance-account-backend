var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'armk100@gmail.com'
    // pass: '@Mohan12345@'
  }
});

var mailOptions = {
  from: 'armk100@gmail.com',
  to: 'mohankumar.anna@gmail.com',
  subject: 'Test mail using nodeJs',
  text: 'Exploring mail sending by Moh...!'
};

function sendMailTo(emailId, accessToken){
  transporter.auth.access_token = accessToken;
  // mailOptions.to = emailId;
  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
    } else {
      console.log('Email sent: '+info.response);
    }
  });

  /*let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          type: 'OAuth2',
          user: 'armk100@gmail.com',
          accessToken: access_token
      }
  }); */

}

module.exports = { sendMailTo };
