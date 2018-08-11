var _ 			= require('lodash');
var	jwt			= require('jsonwebtoken');
var	bcrypt 	= require('bcrypt');
var request = require('superagent');

var	User 		= require('../users/user-model');
var Role 		= require('../authorization/role-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');

var providers = {
	facebook: { url: process.env.facebook_url },
	google: { url: process.env.google_url }
}


// application routing - for Social login
function createSession(request, response){
	logger.log('debug', 'social login routes >> createSession');
	var network = request.body.network;
	var socialToken = request.body.socialToken;
	var profile_name;
	var profile_id;
	var profile_email;
	var userCount;
	var userModel;
	if( !network || !socialToken){
		return response.status(400).send("Network name and Social token are needed");
	}
	validateWithProvider(network, socialToken)
		.then(checkUserAlreadyExist)							// calling inner function1
		.then(getNewOrExistingUser)								// calling inner function2
		.then(getDefaultRole)
		.then(assignDefaultRole)
		.then(sendJwt)														// calling inner function3
		.catch(errorToNotify);												// calling inner function4

			function checkUserAlreadyExist(userProfile){ // implementing inner function1
				logger.log('debug', 'checkUserAlreadyExist(..)');
				extractDataFrom(userProfile);
				return User.where('email', profile_email).count('id'); // returns Promise containing count
			}

			/**
			 * Collect Profile Info as each provider slightly differs in their naming
			 * @return none
			 */
			function extractDataFrom(profile){
				switch(network){
					case 'facebook':
						profile_name = profile.name;
						profile_id	= profile.id;
						break;
					case 'google':
						at = profile.email.indexOf('@');
						profile_name = profile.email.slice(0, at);
						profile_id = profile.sub;
				}
				profile_email = profile.email;
			}

			function getNewOrExistingUser(count) { // implementing inner function2
				logger.log('debug', 'Count is '+count);
				userCount = count;
				if(count > 0){ // if count > 0, it means user exists in the system
					logger.log('debug', 'social user account exist for the user');
					return User.forge({email: profile_email}).fetch(); // returns Promise containing user model
				} else { // if count is 0, then create new user and save it into system
					logger.log('debug', 'social user account do not exist; saving new user')
					return new User({ // returns Promise containing new user model
						name: profile_name,
						password: '',            // non nullable, so set at least an empty string
						social_network_id: profile_id,
						social_network_name: network,
						email: profile_email,
						confirmed: 1
					}).save();
				}
			}

			function getDefaultRole(uModel) {
				userModel = uModel;
				return Role.forge({name: process.env.defaultRole}).fetch(); // default role is 'guest'
			}

			function assignDefaultRole(rModel){
				if(userCount > 0) { // not a new user, then exit
					logger.log('debug', 'No linking for existing user to a default role');
					return new Promise((resolve) => resolve(false));
				}
				let roleId = rModel.id;
				logger.log('debug', 'Linking userId: '+userModel.id+'with roleId: '+roleId);
				userModel.roles().attach(roleId);
				return new Promise((resolve) => resolve(true));
			}
			function sendJwt(status) {	// implementing inner function3
					logger.log('debug', 'sendJwt(..)...Login through social network...');
					let user = userModel.toJSON();
					logger.log('debug', 'social user is: '); logger.log('debug', user);
					let omitList = [
						'password', 	'confirmed',	 'confirmation_code',
						'created_at',	'updated_at',	 'deleted_at'
					];
					return response.status(201).send({
						id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
					});
			}

			function errorToNotify(err){ // implementing inner function4
				logger.error(err);
				response.status(500).json({error: true, data: {message: err.message}});
			}
}

function validateWithProvider(network, socialToken) {
	logger.log('debug', 'validateWithProvider...');

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
