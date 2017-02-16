var _ 			= require('lodash');
var	express 	= require('express');
var	jwt			= require('jsonwebtoken');
var	bcrypt 		= require('bcrypt');

var	User 		= require('../users/user-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');

// application routing
var loginRoutes = module.exports = express.Router();

loginRoutes.route('/sessions/create').post(function(request, response){

	if( !request.body.email || !request.body.password){
		return response.status(400).send("Email and Password needed");
	}
	User.forge( {email: request.body.email} ).fetch()
		.then(model => {
			let user = model.toJSON();
			if(! bcrypt.compareSync(request.body.password, user.password)) {
				return response.status(401).send("Email or Password don't match");
			}
			let omitList = [
							 'password',
							 'confirmed',
							 'confirmation_code',
							 'created_at',
							 'updated_at',
							 'deleted_at'
						];
			return response.status(201).send({
				id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: 60*60*2})
			});

		})
		.catch(err => {
			console.log('Error occurred in retrived log in user details');
			console.log(err);
			return response.status(401).send('Email or Password do not match');
		});
	
});
