var _ 			= require('lodash');
var	jwt			= require('jsonwebtoken');
var	bcrypt 	= require('bcrypt');
//var hello 	= require('hello/dist/hello.all.js');
var request = require('superagent');

var	User 		= require('../users/user-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');
var providers = {
	facebook: {
		url: 'https://graph.facebook.com/me?fields=id,name,email'
	}
};

// application routing - for Social login
function createSession(request, response){
	let network = request.body.network;
	let socialToken = request.body.socialToken;
	if( !network || !socialToken){
		return response.status(400).send("Network name and Social token are needed");
	}
//console.log('createSession(req,res) @social-login-routes...');
console.log('Network is '+network+'; social token: '+socialToken);
	// Validate the social token with network
	validateWithProvider(network, socialToken).then( (profile) => {
		// Return the user data received from network
		//response.send('Authenticated as : ' + profile.id);
console.log('Profile received is:...'); console.log(profile);
		return response.status(201).send({
			id_token: createJwt(profile)
		});
	}).catch( (err) => {
		response.send('Failed!' + err.message);
	});
}
function createJwt(profile) {
	//id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: 60*60*2})
    return jwt.sign(profile, constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'});
}

function validateWithProvider(network, socialToken) {
	return new Promise(function(resolve, reject) {
		// Send a GET request to Facebook with the token as query string
		//
		request
			.get( providers[network].url )
			.set('Accept', 'application/json')
			.query({ "access_token": socialToken })
			.end(function(error, response){
				if( !error && response.statusCode == 200) {
console.log('validateWithProvider...response..'); console.log(response.body);
					resolve(response.body);
				} else {
					reject(error);
				}

			});
	});
}

//export all the functions
module.exports = { createSession };
