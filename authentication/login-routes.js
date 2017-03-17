var _ 			= require('lodash');
var	jwt			= require('jsonwebtoken');
var	bcrypt 		= require('bcrypt');

var	User 		= require('../users/user-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');

// application routing
function createSession(request, response){
	if( !request.body.email || !request.body.password){
		return response.status(400).send("Email and Password needed");
	}

	// Get User details of email
	User.forge( {email: request.body.email} ).fetch()
		.then(model => {
			if(!model) throw new Error('Invalid Email!'); // no user exist for the given email id
			let user = model.toJSON();
			if(! bcrypt.compareSync(request.body.password, user.password)) {
				//return response.status(401).send("Email or Password don't match");
				throw new Error('Email or Password do not match!!')
			}
			let omitList = [
							 'password',
							 'confirmed',
							 'confirmation_code',
							 'created_at',
							 'updated_at',
							 'deleted_at'
						];
			logger.log('info', '/api/login >> createSession()...');
			return response.status(201).send({
				id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: 60*60*2})
			});

		})
		.catch(err => {
			//console.log('Error occurred in retrived log in user details');
			//console.log(err);
			//return response.status(401).send('Email or Password do not match');
			response.statusMessage = err;
			response.status(401).send();
			//throw new Error('Email or Password do not match!!!');
		});
}

//export all the functions
module.exports = { createSession };
