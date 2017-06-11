var https = require('https');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var aptMaint = fs.readFileSync('./AptMaint-9d84488d54cc.json');
var aptMaintJson = JSON.parse(aptMaint);

var now = new Date();
var timenow = now.getSeconds();

let payload = {
  // JWT Headers
  "alg": "RS256",
  "typ": "JWT",

  // JWT Claim set
  "iss": aptMaintJson.client_email,
  "scope": "https://mail.google.com/",
  "aud": "https://www.googleapis.com/oauth2/v4/token"
};

let cert = aptMaintJson.private_key;

let jwtToken = jwt.sign(payload, cert, { expiresIn: timenow + 600 }); // expires in 600 seconds

function createJWT() {
  // console.log('AptMaintJSON...'); console.log(aptMaintJson);
  // console.log('Issuer: ...'); console.log(aptMaintJson.client_email);
  // console.log('Private Key:...'); console.log(cert);
  console.log('Date now: '); console.log(now);
  console.log('Time now: '); console.log(timenow);
  console.log('jwtToken...'); console.log(jwtToken);
}

module.exports = { createJWT };
