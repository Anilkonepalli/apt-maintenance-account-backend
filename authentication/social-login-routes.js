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
	var network = request.body.network;
	var socialToken = request.body.socialToken;
	var profile;

	if( !network || !socialToken){
		return response.status(400).send("Network name and Social token are needed");
	}
	validateWithProvider(network, socialToken) 	// calling inner function1
		.then(checkUserAlreadyExist)							// calling inner function2
		.then(getNewOrExistingUser)								// calling inner function3
		.then(sendJwt)														// calling inner function4
		.catch(sendError);												// calling inner function5

	function checkUserAlreadyExist(userProfile){ // implementing inner function2
console.log('checkUserAlreadyExist...');
		profile = userProfile;
		return User.where('email', profile.email).count('id');
	}
	function getNewOrExistingUser(count) { // implementing inner function3
		console.log('Count is '+count);
		if(count){
			return User.forge({email: profile.email}).fetch();
		} else {
			return new User({
				name: profile.name,
				social_network_id: profile.id,
				social_network_name: network,
				email: profile.email
			}).save();
		}
	}
	function sendJwt(model) {	// implementing inner function4
		console.log('doSendJwt...');console.log(model);
			let user = model.toJSON();
			let omitList = [
				'password', 	'confirmed',	 'confirmation_code',
				'created_at',	'updated_at',	 'deleted_at'
			];
			logger.log('info', 'Login through social network...');
			return response.status(201).send({
				id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
			});
	}
	function sendError(err){ // implementing inner function5
		response.status(500).json({error: true, data: {message: err.message}});
	}

}

function validateWithProvider(network, socialToken) { // implementing inner function1
console.log('validateWithProvider...');
	return new Promise(function(resolve, reject) {
		// Send a GET request to Facebook with the token as query string
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
