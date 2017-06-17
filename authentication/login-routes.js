var _ 			= require('lodash');
var	jwt			= require('jsonwebtoken');
var	bcrypt 		= require('bcrypt');

var	User 		= require('../users/user-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');

var emailer							= require('../authentication/emailer');
var randomstring				= require('randomstring');

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
			if ( !user.confirmed ) {
				throw new Error('Email confirmation pending!');
			}
			if( user.confirmed && user.confirmation_code ) {
				throw new Error('Incomplete Password Reset Request!!');
			}
			if(! bcrypt.compareSync(request.body.password, user.password)) {
				throw new Error('Email or Password do not match!!')
			}
			let omitList = [
				'password',		 'confirmed',		 'confirmation_code',
				'created_at',	 'updated_at',	 'deleted_at'
			];
			logger.log('info', '/api/login >> createSession()...');
			return response.status(201).send({
				id_token: jwt.sign(_.omit(user, omitList), constants.secret, {expiresIn: '2h', issuer: 'Apt-Maint'})
			});

		})
		.catch(err => {
			response.statusMessage = err;
			response.status(401).send();
		});
}

// forgot password
function forgotPassword(request, response){
	if( !request.body.email ){
		return response.status(400).send("Email Id is needed by forgot-password request");
	}
	// Get User details of email
	User
		.forge( {email: request.body.email} )
		.fetch()
		.then(updateWithResetToken)
		.then(sendResponse)
		.catch(error);

	function updateWithResetToken(model) {
		if (!model) { // no user exist for the given email id
			throw new Error('Invalid Email!');
		}
		let user = model.toJSON();
		if ( !user.confirmed ) { // User is registered but is not confirmed
			throw new Error('Email confirmation pending!');
		}
		return model.save({ // field 'confirmation_code' is used for reset token too
			confirmation_code: randomstring.generate(50)
		});
	}

	function sendResponse(model){
		let user = model.toJSON();
		let can_send_email = process.env.can_send_email === 'true';
		let confirmUrl = process.env.ip_address+'/login/forgot-password/'+user.confirmation_code;
		let template = {
			subject: 'Password Reset!',
			body: '',
			html: 'Please click on the link below to reset your password: <br><br>'
							+ '<a href="' + confirmUrl + '">' + confirmUrl + '</a>'
							+'.<br><br><i>If the link does not work, copy and paste it into browser url.</i>'
		};
		console.log('Template is: '); console.log(template);
		emailer.sendMailTo(req.body.email, template);
		res.json({error: false, data:{model: user, emailed: can_send_email}});
	}
	function error(err) {
			logger.log('error', err.message);
			return res.status(500).json({error: true, data: {message: err.message}});
	}

}


//export all the functions
module.exports = { createSession, forgotPassword };
