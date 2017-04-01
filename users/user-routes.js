var	User 				= require('./user-model');
var	Bookshelf 			= require('../config/database');
var getUserPermissions 	= require('../authorization/userPermissionsOnResource');

var Users 				= Bookshelf.Collection.extend({
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
	User.forge({id: req.params.id}).fetch({require: true})
		.then(doUpdate)
		.catch(notifyError);

	function doUpdate(model){
		model.save({
			name: req.body.name || model.get('name')
		})
		.then(function(){
			res.json({error: false, data:{message: 'user Details Updated'}});
		})
		.catch(function(err){
			res.status(500).json({error: true, data: {message: err.message}});
		});
	}
	function notifyError(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /roles/myroles/:id to update an existing User with myroles
// --------------------------------------------------------------------------------------------
function putRoles(req, res) {
	User.forge({id: req.params.id}).fetch({require: true, withRelated:['roles']})
		.then(detachExistingRoles)
		.then(doUpdate)
		.catch(notifyError);

	function detachExistingRoles(model){
		return model.roles().detach();
	}
/*	function doUpdate(model){
		model.roles().detach().then( // remove the existing roles first
			() => model.roles().attach(req.body.myrolesIds)); // attach new roles
		res.json({error:false, data:{ message: 'My Roles are attached'}});
	} */
	function doUpdate(model){
		model.roles().attach(req.body.myrolesIds); // attach new roles
		res.json({error:false, data:{ message: 'My Roles are attached'}});
	}
	function notifyError(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /users to post (to add) a new user
// ---------------------------------------------------------------------
function post(req, res) {
	User.forge({
		name: req.body.name,
	})
	.save()
	.then( model => res.json({error: false, data:{model}}))
	.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
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

module.exports = { getAll, post, get, put, del, getRoles, getPermissions, putRoles };
