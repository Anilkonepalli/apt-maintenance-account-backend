var _ 					 = require('lodash');
var	jwt					 = require('jsonwebtoken');
var	bcrypt 			 = require('bcrypt');

var	User 				 = require('../users/user-model');
var	Bookshelf 	 = require('../config/database');
var	constants		 = require('../config/constants');

var emailer			 = require('../authentication/emailer');
var randomstring = require('randomstring');

// application routing
function createSession(request, response){

	if( !request.body.email || !request.body.password){
		return response.status(400).send("Email and Password needed");
	}

	// Get User details of email
	User.forge( {email: request.body.email} ).fetch({withRelated:['infos']})
		.then(model => {
			if(!model) throw new Error('Invalid Email!'); // no user exist for the given email id
			let user = model.toJSON();
			if ( !user.confirmed ) {
				let msg = 'Email confirmation pending!';
				logger.error(msg)
				throw new Error(msg);
			}
			if( user.confirmed && user.confirmation_code ) {
				clearPasswordReset(model);
			}
			if(! bcrypt.compareSync(request.body.password, user.password)) {
				let msg = 'Email or Password do not match!!';
				logger.error(msg)
				throw new Error(msg);
			}
			let omitList = [
				'password',		 'confirmed',		 'confirmation_code',
				'created_at',	 'updated_at',	 'deleted_at'
			];
			logger.log('debug', '/api/login >> createSession()...');
			return response.status(201).send({
				id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
				//id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: 60*2, issuer: 'Apt-Maint'}) // expires in 2 minutes for testing purpose
			});

		})
		.catch(err => {
			response.statusMessage = err;
			response.status(401).send();
		});

		// clear the existing password reset request, as user is able to login with known password
		function clearPasswordReset(model) {
			logger.log('debug', 'Clearing out password-reset request!');
			model.save({
				confirmation_code: null
			});
		}

}

// forgot password
function forgotPassword(req, res){

	if( !req.body.email ){
		return res.status(400).send("Email Id is required to proceed with forgot-password");
	}
	// Get User details of email
	User
		.forge( {email: req.body.email} )
		.fetch()
		.then(assignResetToken)
		.then(sendResponse)
		.catch(errorToNotify);

	function assignResetToken(model) {
		let msg = '';
		if (!model) { // no user exist for the given email id
			msg = 'Invalid Email!';
			logger.error(msg);
			throw new Error(msg);
		}
		let user = model.toJSON();
		logger.log('debug', 'User object: ');
		logger.log('debug', user);
		if ( !user.confirmed ) { // User is registered but is not confirmed
			msg = 'Email confirmation pending!';
			logger.error(msg);
			throw new Error(msg);
		}
		if (user.confirmed && user.confirmation_code) {
			msg = 'Password Reset Request Already Exists!!';
			logger.error(msg);
			throw new Error(msg);
		}
		return model.save({ // field 'confirmation_code' is used for reset token too
			confirmation_code: randomstring.generate(50)
		});
	}

	function sendResponse(model){
		let user = model.toJSON();
		let can_send_email = process.env.can_send_email === 'true';
		let confirmUrl = process.env.ip_address+'/login/reset/'+user.confirmation_code;
		let template = {
			subject: 'Password Reset!',
			body: '',
			html: 'Please click on the link below to proceed with password reset: <br><br>'
							+ '<a href="' + confirmUrl + '">' + confirmUrl + '</a>'
							+'.<br><br><i>If the link does not work, copy and paste it into browser url.</i>'
		};
		logger.log('debug', 'Template is: ');
		logger.log('debug', template);
		emailer.sendMailTo(req.body.email, template);
		res.json({error: false, data:{emailed: can_send_email}});
	}
	function errorToNotify(err) {
			logger.error(err);
			return res.status(500).json({error: true, data: {message: err.message}});
	}

}


// reset password
function resetPassword(req, res){
	if( !req.body.token ){
		return res.status(400).send("Missing token with reset-password");
	}
	if ( !req.body.resetpassword ){
		return res.status(400).send("Missing password with reset-password");
	}
	// Get User details of email
	User
		.forge( {confirmation_code: req.body.token} )
		.fetch()
		.then(updatePassword)
		.then(sendResponse)
		.catch(errorToNotify);

	function updatePassword(model) {
		let msg = '';
		if (!model) { // no user exist for the given email id
			msg = 'Invalid Token!';
			logger.error(msg);
			throw new Error(msg);
		}
		let user = model.toJSON();
		logger.log('debug', 'User object: ');
		logger.log('debug', user);
		if ( !user.confirmed ) { // User is registered but is not confirmed
			msg = 'Registration confirmation pending!';
			logger.error(msg);
			throw new Error(msg);
		}
		return model.save({ // field 'confirmation_code' is used for reset token too
			confirmation_code: null,
			password: bcrypt.hashSync(req.body.resetpassword, 10)
		});
	}

	function sendResponse(model){
		let user = model.toJSON();
		res.json({error: false, data:{message: 'Password reset is done!'}});
	}
	function errorToNotify(err) {
			logger.error(err);
			return res.status(500).json({error: true, data: {message: err.message}});
	}

}

//export all the functions
module.exports = { createSession, forgotPassword, resetPassword };
