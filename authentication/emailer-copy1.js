var nodemailer = require('nodemailer');
var fs  			 = require('fs');

var aptMaint = fs.readFileSync('./AptMaint-service-account.json');
var aptMaintJson = JSON.parse(aptMaint);


//function sendMailTo(emailId){
function sendMailTo(emailId, accessToken, expiresIn){
  console.log('Send mail to: '+emailId+', Access Token: '+accessToken+', expires in: '+expiresIn);
  console.log('client_id: '); console.log(aptMaintJson.client_id);
  console.log('privateKey: '); console.log(aptMaintJson.private_key);

  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'armk100@gmail.com',
      serviceClient: aptMaintJson.client_id,
      privateKey: aptMaintJson.private_key
    }
  });

  let mailOptions = {
    from: 'armk100@gmail.com',
    to: 'mohankumar.anna@gmail.com',
    // to: emailId,
    subject: 'Test mail using nodeJs',
    text: 'Exploring mail sending by Moh...!'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
    } else {
      console.log('Email sent: '+info.response);
    }
  });

}

module.exports = { sendMailTo };
