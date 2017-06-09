var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'armk100@gmail.com',
    pass: '@Mohan12345@'
  }
});

var mailOptions = {
  from: 'armk100@gmail.com',
  to: 'mohankumar.anna@gmail.com',
  subject: 'Test mail using nodeJs',
  text: 'Exploring mail sending...!'
};

function sendMail(){

  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
    } else {
      console.log('Email sent: '+info.response);
    }
  });

}
