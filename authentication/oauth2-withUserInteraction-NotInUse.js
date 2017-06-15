var https = require('https');
var google = require('googleapis');

var OAuth2 = google.auth.OAuth2;

var CLIENT_ID = '826489296470-t0a9so1jr2cmj0o8au92l6idpnscvcg7.apps.googleusercontent.com';
var CLIENT_SECRET = 'Qo-jrxpdbP8L6WSdzOt8-Bcj';
var REDIRECT_URL = 'http://localhost:8080/oauth2callback';

var oauth2Client = new OAuth2( CLIENT_ID,  CLIENT_SECRET,  REDIRECT_URL );

// generate a url that asks permissions for Google Mail scopes
var scopes = [  'https://mail.google.com/'  ];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',  // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes, // If you only need one scope you can pass it as a string
  // state: { foo: 'bar' } // Optional property that passes state parameters to redirect URI
});

var ACCESS_TOKEN='4%2FF3_cUhAYmVmxpTJ5wyLLL63eIGeSY050TCoX5rvb2AE'; // manually pasted above url into browser

function getAccessToken() {

  console.log('oauth2 url: '); console.log(url);

/*
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });
*/

}

function getCode(req, res) {
  console.log('callback method getCode(req, res)...');
  console.log(req.params);
}



module.exports = { getAccessToken, getCode };
