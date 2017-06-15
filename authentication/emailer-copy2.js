var nodemailer = require('nodemailer');
var fs  			 = require('fs');

//var aptMaint = fs.readFileSync('./AptMaint-service-account.json');
//var aptMaintJson = JSON.parse(aptMaint);

var aptMaintUserAcct = fs.readFileSync('./AptMaint-user-account.json');
var aptMaintUserAcctJson = JSON.parse(aptMaintUserAcct);

//function sendMailTo(emailId){
function sendMailTo(emailId, accessToken, expiresIn){
  console.log('Send mail to: '+emailId+', Access Token: '+accessToken+', expires in: '+expiresIn);
  console.log('client_id: '); console.log(aptMaintUserAcctJson.web.client_id);
  console.log('privateKey: '); console.log(aptMaintUserAcctJson.web.client_secret);

  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      clientId: aptMaintUserAcctJson.web.client_id,
      clientSecret: aptMaintUserAcctJson.web.client_secret
    }
  });

  let mailOptions = {
    from: 'armk100@gmail.com',
    to: 'mohankumar.anna@gmail.com',
    // to: emailId,
    subject: 'Test mail using nodeJs',
    text: 'Exploring mail sending by Moh...!'
  };

  transporter.sendMail({
    from: 'armk100@gmail.com',
    to: 'mohankumar.anna@gmail.com',
    subject: 'Test mail...from moh',
    text: 'Hope this message gets through!',
    auth: {
      user: 'armk100@gmail.com',
      accessToken: accessToken,
      expires: expiresIn
    }
  });

}

module.exports = { sendMailTo };
