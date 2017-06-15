var https = require('https');
var querystring = require('querystring');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var aptMaint = fs.readFileSync('./AptMaint-service-account.json');
var aptMaintJson = JSON.parse(aptMaint);

let payload = {
  "scope": "https://mail.google.com/"
};

let cert = aptMaintJson.private_key;
let url = "https://www.googleapis.com/oauth2/v4/token";

let jwt_options = {
  algorithm: 'RS256',
  issuer: aptMaintJson.client_email,
  audience: "https://www.googleapis.com/oauth2/v4/token",
  expiresIn: '1h',
}

let jwtToken = jwt.sign(payload, cert, jwt_options);

// form data
let postData = querystring.stringify({
  grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
  assertion: jwtToken
});

// request option
let http_options = {
  host: 'www.googleapis.com',
  port: 443,
  method: 'POST',
  path: '/oauth2/v4/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': postData.length
  }
};

function get() {
  return new Promise( function(resolve, reject) {
    // request object
    let req = https.request(http_options, (res) => {
      let result = '';
      res.on('data', (chunk) => {
        result += chunk;
      });
      res.on('end', ()=> {
        console.log(result);
        let resultInJson = JSON.parse(result);
        console.log('Result in JSON: '); console.log(resultInJson);
        console.log('Access Token: '); console.log(resultInJson.access_token);
        resolve(resultInJson);
      });
      res.on('error', (err) => {
        console.error(err);
        reject(err);
      });
    });

    // req error
    req.on('error', (err) => {
      console.log(err);
    });

    // send request with postData form
    req.write(postData);
    req.end();
  });
}

module.exports = { get };
