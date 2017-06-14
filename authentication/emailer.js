let nodemailer = require('nodemailer');

//function sendMailTo(emailId){
function sendMailTo(emailId, accessToken, expiresIn){
  console.log('Send mail to: '+emailId+', Access Token: '+accessToken+', expires in: '+expiresIn)
  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'armk100@gmail.com',
      serviceClient: '107052834257796482119',
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFrZ1AUxnSDYgi\njGDPV7l27pfaod3xtju/kqrwxwHK8ENpiyC8AXo1fW89i15KoY8xmrLPLgUwGLS9\nBHLywwdxELGpgIphQJvsuTYkcVhoGCmAOjrSpJG/aeV1Exsus2RdB3rdPDHs4/6J\nLaUhqIo8v3U3OG3Uzcb6VMwKpco8hVfWAV9t+vpN2HxWXKVvTqth+i5l5BeayX7R\nN7ntzGmbNruR+fFrJ4Nja9GQDjAq4yaH9g2tmi8gkyMqbihvv/BxG4bX+nOViQAv\nFGApmc/sjwkoBA+bNs67PvxevaQw9WwS9XHFLt/yuYAfUm0IcCZS2ioOigykO9mI\nDCryyR5pAgMBAAECggEAB1wXZrWxWGi4kNC5Kf8SIKNxc+pi4QTv5IoJYz2Fi5C2\ncc+EQHutmSA6bAgsUosBUc94qM4F02yYDhGEVhV8yXDdrHnkrQpCw+WBZonxyK5d\nnTCN0Bngc0f2Cw3TDUIQkoYcxO/gy/kRGPpiE4a63tgh/RRUwn+G0PsnPZ4+kVI0\n2raweVP8nUDX2sukBGz7SWBqmpmLekxnuLo4cjhDOFJEO72CjsMBw3odplfRnHPW\nj/YrvE2mKF3omSbfZe5wIu/5TRskNyxl8QrgR6KxK416syfn2jHhK/lBzMiRCQhs\neluIODJhLJ+WazdxXDV0bkZ81/WL3NOStLHW5SNEgQKBgQDhupufCNOMFMAnv/nB\nXQ/3wGfpb3pp2PfJD92D+/+ICXkaCmWm9SYwOM8z8p0n9rgcUOJJbNG0/Mp/ZPZV\nTZCNZpIJ52dOZ8rj+PuNKjhkHhHdtzoQu5VNFaPYZEAURLAJicNfXZ4fbMd20OeS\njftvEcat4KNL0OvNFgt2gT5IbQKBgQDgMAJf3mQUSHhRsAoLg3OcTT+YlJ0Ul90/\ntWXWofz+C7WZWGSgdxmcWTVCFA3+hdolg8zfsRwnQLvyxK8p69rQ2dfxE1xy/qzJ\nYn8V4bETBTAiJCKmhaOr1t9ca429FGgPJibj2XGNbYZH9oK2179ZshTWJu+VxRph\nMOV4HjhobQKBgQCO4FjkXufYAMJn5qGlfMxAmy6qmP84xDaCs2IYyobBio12qCIT\nfZRAbZTpYqWKyCVc9u1kYFaUYnWiETvCXqgieEvzrN68yAGqLsy6W4D6DfZtCi7c\nrH8iHZJpw3qz2Y47W1GoqU8OwQG3+R66qtf9Q5koMcnqkUDPvSZgSgosOQKBgEvF\nLihEu8J3M+M4Ak0d4ocjPKlPIUACi86qen7uRNmAD6KCU5BAcLF9HRj2OjyZ9L7V\nKvs3mvJRWLSWcTVT96K63dcm2gortS5jUdyNaRGqoTgIyoVJiaXce6V63G7ZZMop\n9N7xcQWBzO6pjEhL5upj29L9WeBeu6m5ovTUEfCJAoGBAIAe2C84AQG7ChCszsDR\n9HHFf20tru5CIFSpxZC9b+3W6HByJ2fWV+rQDTeQhXhP+E6LQl6IV4yBPcduDKQU\nIVDNdrIj3IlQabX8FGpQJCmS61+4cofYps9FFbtv5y4K+GOLdcwOuzaPPDnNKE1Z\noD+P1T3opXBrXomoS7wkbr54\n-----END PRIVATE KEY-----\n"
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
