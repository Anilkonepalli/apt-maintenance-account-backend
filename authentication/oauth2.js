var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var CLIENT_ID = '826489296470-t0a9so1jr2cmj0o8au92l6idpnscvcg7.apps.googleusercontent.com';
var CLIENT_SECRET = 'Qo-jrxpdbP8L6WSdzOt8-Bcj';
var REDIRECT_URL = 'http://localhost:8080/oauth2callback';

var oauth2client = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);


// generate a url that asks permissions for Google Mail scopes
var scopes = [
  'https://mail.google.com/'
];

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes,

  // Optional property that passes state parameters to redirect URI
  // state: { foo: 'bar' }
});
