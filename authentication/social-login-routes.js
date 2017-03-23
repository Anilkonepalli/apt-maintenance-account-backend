var _ 			= require('lodash');
var	jwt			= require('jsonwebtoken');
var	bcrypt 	= require('bcrypt');
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
	validateWithProvider(network, socialToken)
		.then(checkUserAlreadyExist)							// calling inner function1
		.then(getNewOrExistingUser)								// calling inner function2
		.then(sendJwt)														// calling inner function3
		.catch(sendError);												// calling inner function4

			function checkUserAlreadyExist(userProfile){ // implementing inner function1
				logger.log('info', 'checkUserAlreadyExist(..)');
				profile = userProfile;
				return User.where('email', profile.email).count('id'); // returns Promise containing count
			}
			function getNewOrExistingUser(count) { // implementing inner function2
				logger.log('info', 'Count is '+count);
				if(count){ // if count > 0, it means user exists in the system
					return User.forge({email: profile.email}).fetch(); // returns Promise containing user model
				} else { // if count is 0, then create new user and save it into system
					return new User({ // returns Promise containing new user model
						name: profile.name,
						social_network_id: profile.id,
						social_network_name: network,
						email: profile.email
					}).save();
				}
			}
			function sendJwt(model) {	// implementing inner function3
					logger.log('info', 'sendJwt(..)...Login through social network...');
					let user = model.toJSON();
					let omitList = [
						'password', 	'confirmed',	 'confirmation_code',
						'created_at',	'updated_at',	 'deleted_at'
					];
					return response.status(201).send({
						id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
					});
			}
			function sendError(err){ // implementing inner function4
				logger.log('error', err.message);
				response.status(500).json({error: true, data: {message: err.message}});
			}
}

function validateWithProvider(network, socialToken) {
	logger.log('info', 'validateWithProvider...');
	return new Promise(function(resolve, reject) {
		// Send a GET request to Facebook with the token as query string
		request
			.get( providers[network].url )
			.set('Accept', 'application/json')
			.query({ "access_token": socialToken })
			.end(function(error, response){
				if( !error && response.statusCode == 200) {
					resolve(response.body);
				} else {
					reject(error);
				}
			});
	});
}

//export all the functions
module.exports = { createSession };
