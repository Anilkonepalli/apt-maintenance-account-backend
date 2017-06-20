var	User 								= require('./user-model');
var	Bookshelf 					= require('../config/database');
var getUserPermissions 	= require('../authorization/userPermissionsOnResource');
var bcrypt 							= require('bcrypt');
var auth 								= require('../authorization/authorization');
var emailer							= require('../authentication/emailer');
var randomstring				= require('randomstring');
var constants 					= require('../config/constants.json');

var Users 	= Bookshelf.Collection.extend({
	model: User
});

// on routes that end in /users
// get all the user models (accessed at GET http://localhost:3002/api/users)
// ---------------------------------------------------------------------
function getAll(req, res) {
	Users.forge().fetch()
		.then(models => res.json(models))
		.catch(err => res.send(err));
}

// on routes that end in /users/:id to get an user
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new user model
		res.json(new User());
	} else { // respond with fetched user model
		User.forge( {id: req.params.id} ).fetch()
			.then(model => res.json(model))
			.catch(err => res.send(err));
	}
}


// on routes that end in /Users/rolesfor/:id to get an User with associated roles
// ---------------------------------------------------------------------
function getRoles(req,res) {
	User.forge( {id: req.params.id} ).fetch({withRelated: ['roles']})
		.then(model => {
			let modelJson = model.toJSON();
			res.json(modelJson.roles);
		})
		.catch(err => res.send(err));
}


// on routes that end in /Users/allpermissions to get all permissions of user
// ---------------------------------------------------------------------
function getAllPermissions(req, res) {
	let userId = req.decoded.id;
	logger.log('debug', 'getAllPermissions(..)..userId is: '+userId);
	getUserPermissions(userId)
		.then(perms => res.json(perms))
		.catch(err => res.send(err));
}


// on routes that end in /Users/mypermissions/:name to get permissions of 'name' module
// ---------------------------------------------------------------------
function getPermissions(req, res) {
	let userId = req.decoded.id;
	let resource = req.params.name;
	getUserPermissions(userId, resource)
		.then(perms => res.json(perms))
		.catch(err => res.send(err));
}

// on routes that end in /users/:id to update an existing user
// ---------------------------------------------------------------------
function put(req, res) {

	let userName = req.body.name;
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let email = req.body.email;
	let password = req.body.password;
	let model;

	User
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(sendResponse)
		.catch(error);

	function doAuth(model) {
		this.model = model;
		return auth.allowsEdit(req.decoded.id, 'users', model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.log('info', 'checkForDuplicate(...)!');
		logger.log('info', 'granted...'+granted);
		return User
			.where({ email: email })
		  .count('id'); // returns Promise containing count
	}
	function doUpdate(count){
		logger.log('info', 'count is: '+count);
		if(count) {
		 throw new Error('Duplicate Error!! email-id already exists!!');
	 	}
		logger.log('info', '/api/users >> put()...updating user details');
		return this.model.save({
			name: userName || this.model.get('name'),
			first_name: firstName || this.model.get('first_name'),
			last_name: lastName || this.model.get('last_name'),
			email: email || this.model.get('email'),
			password: bcrypt.hashSync(password, 10) || this.model.get('password')
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'User profile updated'}});
	}
	function error(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}


// on routes that end in /roles/myroles/:id to update an existing User with myroles
// --------------------------------------------------------------------------------------------
function putRoles(req, res) {

	let userModel;
	logger.log('debug', 'Inside user-routes >> putRoles(req,res)...');
	logger.log('debug', 'req params id: '+req.params.id);
	User.forge({id: req.params.id}).fetch({require: true, withRelated:['roles']})
		.then(detachExistingRoles)
		.then(attachNewRoles)
		.then(sendResponse)
		.catch(errorToNotify);

	function detachExistingRoles(model){
		userModel = model;
		logger.log('debug', 'Inside user-routes >> detachExistingRoles(model)...');
		logger.log('debug', model.toJSON());
		return model.roles().detach();
	}

	function attachNewRoles(){
		logger.log('debug', 'inside user-routes >> attachNewRoles(model)...');
		logger.log('debug', userModel.toJSON());
		return userModel.roles().attach(req.body.myrolesIds); // attach new roles
	}

	function sendResponse(aColl) {
		logger.log('debug', 'Inside user-routes >> sendResponse(aColl)...');
		res.json({error:false, data:{ message: 'My Roles are attached'}});
	}

	function errorToNotify(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}

}


// on routes that end in /users to post (to add) a new user
// ---------------------------------------------------------------------
function post(req, res) {
	logger.log('info', 'adding new user...name: '+req.body.name+', first name: '+req.body.first_name);
	let tempModel = null;

	totalRecords()
	.then(checkForDuplicate)
	.then(doSave)
	.then(sendResponse)
	.catch(error);

	function totalRecords() {
		let tableName = User.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.log('debug', 'Max Records in DISABLED state!');
			return new Promise((resolve) => resolve(''));
		}
		logger.log('debug', 'Max Records in ENABLED state');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function checkForDuplicate(total) {
		if(total && total[0].CNT >= constants.maxRecords.users) {
			let msg = 'Maximum Limit Reached! User registration is closed';
			logger.log('error', msg);
			throw new Error(msg);
		}
		return User
		.where({ email: req.body.email })
		.count('id'); // returns Promise containing count
	}

	function doSave(count) {
		if(count) {
			let msg = 'Duplicate Error! email-id already exists!';
			logger.log('debug', msg);
			throw new Error(msg);
		}
		logger.log('info', '/api/users >> post()...saving new user profile');
		return User.forge({
			name: req.body.name,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			confirmation_code: randomstring.generate(50)
		}).save();
	}

	function sendResponse(model) {
		let can_send_email = process.env.can_send_email === 'true';
		res.json({error: false, data:{emailed: can_send_email}});
		let modelJson = model.toJSON();
		let confirmUrl = process.env.ip_address+'signup/'+modelJson.confirmation_code;
		let template = {
			subject: 'Thanks for Signing up!',
			body: '',
			html: 'To complete signup process, please click on the below link: <br><br>'
							+ '<a href="' + confirmUrl + '">' + confirmUrl + '</a>'
							+'.<br><br><i>If the link does not work, copy and paste it into browser url.</i>'
		};
		logger.log('debug', 'Template is: ');
		logger.log('debug', template);
		logger.log('debug', 'confirmation_code: '+modelJson.confirmation_code);
		logger.log('debug', modelJson);
		emailer.sendMailTo(req.body.email, template);
	}

	function error(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}


// on routes that end in /users/:id to delete an user
// ---------------------------------------------------------------------
function del(req, res) { // using full form 'delete' causes error, hence short form 'del' is used here - yet to analyze root cause
	User.forge({id: req.params.id}).fetch({require: true})
		.then(doDelete)
		.catch(notifyError);

	function doDelete(model){
		model.destroy()
			.then( () => res.json({error: true, data: {message: 'User model successfully deleted'} }))
			.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
	}
	function notifyError(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /api/signup/:code to confirm newly registered User
// --------------------------------------------------------------------------------------------
function confirmSignup(req, res) {

	let model;

	checkForRecord()
		.then(fetchRecord)
		.then(updateStatus)
		.then(sendResponse)
		.catch(error);

	function checkForRecord() {
		return User
			.where({confirmation_code: req.params.code})
			.count('id'); // returns Promise containing count
	}
	function fetchRecord(count) {
		if(!count) {
			throw new Error('Invalid code!');
		}
		return User
			.forge({confirmation_code: req.params.code})
			.fetch({require: true});
	}
	function updateStatus(model) {
		logger.log('debug', 'inside user-routes >> updateStatus for model: ');
		logger.log('debug', model);
		this.model = model;
		return this.model.save({
			confirmed: 1,
			confirmation_code: null
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Signup process is now completed!'}});
	}
	function error(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}



module.exports = { getAll, post, get, put, del, getRoles, getPermissions, putRoles, getAllPermissions, confirmSignup };
