var	User 								= require('../users/user-model');
var	Bookshelf 					= require('../config/database');
var getUserPermissions 	= require('../authorization/userPermissionsOnResource');
var bcrypt 							= require('bcrypt');
var auth 								= require('../authorization/authorization');


// on routes that end in /userprofile/:id to get an user
// ---------------------------------------------------------------------
function get(req, res) {
		User.forge( {id: req.params.id} ).fetch()
			.then(model => res.json(model))
			.catch(err => res.send(err));
}

// on routes that end in /userprofile/:id to update an existing user
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
		logger.log('info', '/api/userprofile >> put()...updating user details');
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

module.exports = { get, put };
