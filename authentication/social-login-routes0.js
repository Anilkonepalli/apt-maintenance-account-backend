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
/*	validateWithProvider(network, socialToken).then( (profile) => {
		// Return the user data received from network
		//response.send('Authenticated as : ' + profile.id);
console.log('Profile received is:...'); console.log(profile);
		return response.status(201).send({
			id_token: createJwt(profile)
		});
	}).catch( (err) => {
		response.send('Failed!' + err.message);
	}); */
	doValidateWithProvider(network, socialToken)
		.then( (profile) => {
console.log('Social User profile is...'); console.log(profile);
						User.forge( {email: profile.email, social_network_id: profile.id} ).fetch()
							.then(model => {
								let user;
								if(model) {
									user = model.toJSON();
									console.log('Existing user...'); console.log(user);
								} else {
									let newUser = new User({
										id: 0,
										name: profile.name,
										social_network_id: profile.id,
										social_network_name: this.network,
										email: profile.email
									});
									user = newUser.toJSON();
									console.log('New User in JSON format ...'); console.log(user);
									newUser.save()
										.then( (anUser) => {
											console.log('A new user saved into database...'); console.log(anUser);
										})
										.catch( err => console.log('Error in saving new user ...'+err.message));
								}
								console.log('retrieved user is: ...'); console.log(user);
								//return user;
							})
							.catch(err => {
								console.log('Error in retrieving user...');console.log(err.message);
								//throw new Error('User Fetch Error during Social Login');
							});
console.log('User in validateWithProvider...'); console.log(user);
		})
		.catch(doSendError);
}

function doValidateWithProvider(network, socialToken) {
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

/*
function createJwt(profile) {
	//id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: 60*60*2})
    return jwt.sign(profile, constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'});
}
*/

/*
function doGetAppUser(profile) {
console.log('doGetAppUser...');console.log(profile);
	return User
		.forge( {email: profile.email, social_network_id: profile.id} )
		.fetch();
}
*/

function getUser(profile) {
	logger.log('info', 'getUser() ...');
	User.forge( {email: profile.email, social_network_id: profile.id} ).fetch()
		.then(model => {
			let user;
			if(model) {
				user = model.toJson();
			} else {
				user = new User({
					id: 0,
					name: profile.name,
					social_network_id: profile.id,
					social_network_name: this.network,
					email: profile.email
				}).toJson();
			}
console.log('retrieved user is: ...'); console.log(user);
			return user;
		})
		.catch(err => {
console.log('Error in doGetAppUser...');console.log(err);
			//throw new Error('User Fetch Error during Social Login');
		});
}


/*
function doSaveNewUser(model) {
console.log("doSaveNewUser....");console.log(model);
console.log('profile...'); console.log(profile);
console.log('network...'); console.log(network);
	if(model == null) {
console.log('create new user...');
		return new User({
			name: profile.name,
			social_network_id: profile.id,
			social_network_name: this.network,
			email: profile.email
		}).save(); // if no user fetched, create a new user
		//.then(mdl => resolve(model)).catch(err => reject(err));
		//logger.log('info', 'New user Logged in through social network ...saving...');
	} else {
console.log('return existing user...');
		return new Promise(function(resolve, reject) {
			if(model.id > 0) resolve(model);
			else reject(model);
		});
	}
}
*/


function doSendJwt(model) {
console.log('doSendJwt...');console.log(model);
	let user = model.toJSON();
	let omitList = [
					 'password',
					 'confirmed',
					 'confirmation_code',
					 'created_at',
					 'updated_at',
					 'deleted_at'
				];
	logger.log('info', 'Login through social network...');
	return response.status(201).send({
		id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
	});
}

function doSendError(err){
	response.status(500).json({error: true, data: {message: err.message}});
}


//export all the functions
module.exports = { createSession };
