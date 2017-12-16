var	User 								= require('./user-model');
var	Bookshelf 					= require('../config/database');
var getUserPermissions 	= require('../authorization/userPermissionsOnResource');
var bcrypt 							= require('bcrypt');
var auth 								= require('../authorization/authorization');
var emailer							= require('../authentication/emailer');
var randomstring				= require('randomstring');
var constants 					= require('../config/constants.json');
var knex								= Bookshelf.knex;

var Info 							  = require('./info-model');

var Users 	= Bookshelf.Collection.extend({
	model: User
});

var Infos = Bookshelf.Collection.extend({
	model: Info
});

var myResourceName; // possible resource names are: users, user-profile

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
		User.forge( {id: req.params.id} ).fetch({withRelated: ['infos']})
			.then(model => res.json(model))
			.catch(err => res.send(err));
	}
}

// on routes that end in /users/myinfos/:id to get an User with associated infos
// Note: Below function is redundant as get on User fetches infos; so below method
// is not used for now.
// ---------------------------------------------------------------------
function getInfos(req,res) {
	User.forge( {id: req.params.id} ).fetch({withRelated: ['infos']})
		.then(model => {
			let modelJson = model.toJSON();
			res.json(modelJson.infos);
		})
		.catch(err => res.send(err));
}



// on routes that end in /Users/myroles/:id to get an User with associated roles
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
	myResourceName = 'users';
	return putCommon(req, res);
}

// on routes that end in /users/myinfos/:id to update an existing User with my infos
function putProfile(req, res) {
	myResourceName = 'user-profile';
	return putCommon(req, res);
}

function putCommon(req, res){
	console.log('Rquest obj: ...'); console.log(req);
	console.log('req body: ...'); console.log(req.body);
	console.log('req params: ...'); console.log(req.params);
	let userName = req.body.name;
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let email = req.body.email;
	let password = req.body.password;
	let infos = req.body.infos;
	let isSocial = false; // is the user logged in through social network
	let model;

	User
		.forge({id: req.params.id})
		.fetch({require: true, withRelated: ['infos']})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(updateInfos)
		.then(sendResponse)
		.catch(error);

	function doAuth(model) {
		this.model = model;
		this.isSocial = this.model.toJSON().social_network_id !== null;
		return auth.allowsEdit(req.decoded.id, myResourceName, model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.log('debug', 'checkForDuplicate(....)!!');
		logger.log('debug', 'granted....'+granted);
		logger.log('debug', 'email....'+email);
		logger.log('debug', 'this.email....'+this.email);
		logger.log('debug', 'req.body.email....'+req.body.email);
		if(this.isSocial) {// no dup check for social user, so just return count as 0 (zero)
			this.email = null; // nullify any email string found in the request parameter
			return new Promise((resolve) => resolve(0));
		}
		if(this.model.toJSON().email === req.body.email) // no dup check if no change in email, just return 0 (zero)
			return new Promise((resolve) => resolve(0));
		return User
			.where({ email: req.body.email })
		  .count('id'); // returns Promise containing count
	}
	function doUpdate(count){
		logger.log('debug', 'count is: '+count);
		if(count) {
		 throw new Error('Duplicate Error!! email-id already exists!!');
	 	}
		logger.log('debug', '/api/users >> put()...updating user details');
		let encyptedPassword = password ? bcrypt.hashSync(password, 10) : password;
		return this.model.save({
			name: userName || this.model.get('name'),
			first_name: firstName || this.model.get('first_name'),
			last_name: lastName || this.model.get('last_name'),
			email: email || this.model.get('email'),
			password: encyptedPassword || this.model.get('password')
		});
	}
	function updateInfos() {
		let existingInfo;
		let promises = [];
		let aPromise;
		logger.log('debug', 'Updating Infos....'); logger.log('debug', req.body.infos);
		req.body.infos && req.body.infos.forEach(eachUi => {
			let infos = this.model.toJSON().infos;
			logger.log('debug', 'Infos in db...'); logger.log('debug', infos);
			existingInfo = infos.filter((eachDb) => eachDb.key === eachUi.key);
			logger.log('debug', 'Existing Info..'); logger.log('debug', existingInfo);
			if(existingInfo.length > 0){ // info exists in db, check whether it is changed
				if(!eachUi.value){ // info is null or empty, then remove from db
					logger.log('debug', 'Removing empty info...'); logger.log(eachUi);
					aPromise = knex('infos')
											.where('user_id', '=', this.model.id)
											.andWhere('key', '=', eachUi.key)
											.del();
					promises.push(aPromise);
				} else if(existingInfo.value !== eachUi.value) { // value modified w.r.t. value in db
					logger.log('debug', 'Updating modified info...old value: '+existingInfo.value+', to new value: '+eachUi.value);
					aPromise = knex('infos')
						.where('user_id', '=', this.model.id)
						.andWhere('key', '=', eachUi.key)
						.update({
							value: eachUi.value
						});
					promises.push(aPromise);
				}
			} else { // no info in db, so add one
				eachUi['user_id'] = this.model.id;
				logger.log('debug', 'adding new info...'); logger.log('debug', eachUi);
				aPromise = knex('infos').insert(eachUi);
				promises.push(aPromise);
			}
		});
		return Promise.all(promises);
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'User profile updated'}});
	}
	function error(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}


// on routes that end in /users/myinfos/:id to update an existing User with my infos
// Note: Below function is not used as the behavior is covered while saving/updating
// User
// --------------------------------------------------------------------------------------------
function putInfos(req, res) {

	let userModel;
	logger.log('debug', 'Inside user-routes >> putInfos(req,res)...');
	logger.log('debug', 'req params id: '+req.params.id);
	User.forge({id: req.params.id}).fetch({require: true})
		.then(detachExistingInfos)
		.then(attachNewInfos)
		.then(sendResponse)
		.catch(errorToNotify);

	function detachExistingInfos(model){
		userModel = model;
		logger.log('debug', 'Inside user-routes >> detachExistingInfos(model)...');
		logger.log('debug', model.toJSON());
		return knex('infos').where('user_id', req.params.id).del(); // it deletes all rows where user_id = req.params.id
	}

	function attachNewInfos(delResult){
		logger.log('debug', 'inside user-routes >> attachNewInfos(model)...');
		logger.log('debug', userModel.toJSON());
		let promises = [];
		JSON.parse(req.body.myInfos).forEach(each => {
			promises.push( knex('infos').insert(each) );
		});
		return Promise.all(promises);
	}

	function sendResponse(aColl) {
		logger.log('debug', 'Inside user-routes >> putInfos() >> sendResponse(aColl)...');
		res.json({error:false, data:{ message: 'My Infos are attached'}});
	}

	function errorToNotify(err){
		res.status(500).json({error: true, data: {message: err.message}});
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
	logger.log('debug', 'adding new user...name: '+req.body.name+', first name: '+req.body.first_name);
	let model = null;

	getTotalForMaxCheck()
	.then(getCountForDupCheck)
	.then(doSave)
	.then(addInfos)
	.then(sendResponse)
	.catch(error);

	function getTotalForMaxCheck() {
		let tableName = User.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.log('debug', 'Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.log('debug', 'Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function getCountForDupCheck(total) {
		if(total && total[0].CNT >= constants.maxRecords.users) {
			let msg = 'Maximum Limit Reached! User registration is closed';
			throw new Error(msg);
		}
		return User
		.where({ email: req.body.email })
		.count('id'); // returns Promise containing count
	}

	function doSave(count) {
		if(count) {
			let msg = 'Duplicate Error! email-id already exists!';
			throw new Error(msg);
		}
		logger.log('debug', '/api/users >> post()...saving new user profile');
		return User.forge({
			name: req.body.name,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			confirmation_code: randomstring.generate(50)
		}).save();
	}
	function addInfos(model){
		this.model = model;
		logger.log('debug', 'infos...');
		logger.log('debug', req.body.infos);
		let promises = [];
		req.body.infos.forEach(each => {
			each['user_id'] = model.id;
			logger.log('debug', each);
			promises.push( knex('infos').insert(each) );
		});
		return Promise.all(promises);
	}
	function sendResponse(model) {
		let can_send_email = process.env.can_send_email === 'true';
		res.json({error: false, data:{emailed: can_send_email}});
		let modelJson = this.model.toJSON();
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
function del(req, res) { // using full form 'delete' causes error, so 'del' is used
	let userModel;

	User.forge({id: req.params.id}).fetch({require: true, withRelated:['infos']})
		.then(getDependants)
		.then(deleteDependants)
		.then(doDeleteUser)
		.catch(notifyError);

	// for now, a work around to delete dependants is done here
	function getDependants(model){ // yet to explore a better way to delete dependants with soft delete
		userModel = model;
		return Infos.forge({user_id: model.id}).fetch({require: true});
	}

	function deleteDependants(infos){
		let promises = [];
		infos.forEach(each => {
			promises.push( each.destroy() );
		});
		return Promise.all(promises);
	}
	function doDeleteUser(){
		userModel.destroy()
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

module.exports = { getAll, post, get, put, del, putProfile, getInfos, putInfos, getRoles, putRoles, getPermissions, getAllPermissions, confirmSignup };
