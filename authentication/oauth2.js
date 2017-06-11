var https = require('https');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var aptMaint = fs.readFileSync('./AptMaint-9d84488d54cc.json');
var aptMaintJson = JSON.parse(aptMaint);

var today = new Date();
var todayUTC = today.toUTCString();
var todaySeconds = Math.floor( today.getTime() / 1000 ) - 300;
var expiry = todaySeconds + 600;

let payload = {
  // JWT Headers
  "alg": "RS256",
  "typ": "JWT",

  // JWT Claim set
  "iss": aptMaintJson.client_email,
  "scope": "https://mail.google.com/",
  "aud": "https://www.googleapis.com/oauth2/v4/token",
  "iat": todaySeconds
};

let cert = aptMaintJson.private_key;

let jwtToken = jwt.sign(payload, cert, { expiresIn: expiry }); // expires in 600 seconds
//let jwtToken = jwt.sign(payload, cert); // expires in 600 seconds

function createJWT() {
  console.log('Today: '+today);
  console.log('Today UTC: '+todayUTC);
  console.log('todaySeconds: '+todaySeconds);
  console.log('jwtToken...'); console.log(jwtToken);
}

module.exports = { createJWT };
