var https = require('https');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var aptMaint = fs.readFileSync('./AptMaint-9d84488d54cc.json');
var aptMaintJson = JSON.parse(aptMaint);

/*
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
  "aud": "https://www.googleapis.com/oauth2/v4/token"
}; */

let payload = {
  "scope": "https://mail.google.com/"
};

let cert = aptMaintJson.private_key;
let url = "https://www.googleapis.com/oauth2/v4/token";

let options = {
  algorithm: 'RS256',
  issuer: aptMaintJson.client_email,
  audience: "https://www.googleapis.com/oauth2/v4/token",
  expiresIn: '1h',
}

//let jwtToken = jwt.sign(payload, cert, { expiresIn: expiry }); // expires in 600 seconds
let jwtToken = jwt.sign(payload, cert, options); // expires in 600 seconds

function createJWT() {
  console.log('jwtToken...'); console.log(jwtToken);
}
function getAccessToken() {
  https.post(url, (res) => {
    res.on('data', (d) => {
      console.log(d);
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

module.exports = { createJWT };
