var	express 	= require('express');
var	jwt			= require('jsonwebtoken');

var	Role 		= require('./role-model');
var	Bookshelf 	= require('../config/database');
var	constants	= require('../config/constants');

var Roles 		= Bookshelf.Collection.extend({
	model: Role
});

// application routing
var roleRoutes 	= module.exports = express.Router();


// api routes

// middleware to use for all requests
roleRoutes.use(function(req, res, next){
	// do logging
	console.log('Role Access is happening...');

	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log('JWT Token from client: ...');
	console.log(token);

	// decode token
	if(token) {
		// verifies secret and checks exp
		jwt.verify(token, constants.secret, function(err, decoded){
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token'});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided in roleRoutes.'
		});
	}
});


// on routes that end in /Roles
// ---------------------------------------------------------------------
roleRoutes.route('/')
	// get all the Role models (accessed at GET http://localhost:3002/api/Roles)
	.get(function(req, res){
		Roles.forge().fetch()
			.then(models => res.json(models))
			.catch(err => res.send(err));
	});

// on routes that end in /Roles/:id to get an Role
// ---------------------------------------------------------------------
roleRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new Role model
			res.json(new Role());
		} else { // respond with fetched Role model
			Role.forge( {id: req.params.id} ).fetch()
				.then(model => res.json(model))
				.catch(err => res.send(err));
		}
	});

// on routes that end in /Roles/myPermissions/:id to get an Role
// ---------------------------------------------------------------------
roleRoutes.route('/mypermissions/:id')
	.get(function(req, res) {
		Role.forge( {id: req.params.id} ).fetch({withRelated: ['permissions']})
			.then(model => {
				let modelJson = model.toJSON();
				res.json(modelJson.permissions); 
			})
			.catch(err => res.send(err));
	});

// on routes that end in /Roles/:id to update an existing Role
// ---------------------------------------------------------------------
roleRoutes.route('/:id')
	.put(function(req, res) {
		Role.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(model){
			model.save({
				name: req.body.name || model.get('name')
			})
			.then(function(){
				res.json({error: false, data:{message: 'Role Details Updated'}});
			})
			.catch(function(err){
				res.status(500).json({error: true, data: {message: err.message}});
			});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

	});


// on routes that end in /roles/mypermissions/:id to update an existing Role with mypermissions
// --------------------------------------------------------------------------------------------
roleRoutes.route('/mypermissions/:id')
	.put(function(req, res) {
		Role.forge({id: req.params.id}).fetch({require: true, withRelated:['permissions']})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(model){
			model.permissions().detach().then( // remove the existing permissions first
				() => model.permissions().attach(req.body.mypermissionsIds)); // attach new permissions
			res.json({error:false, data:{ message: 'My Permissions are attached to Role'}});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

	});


// on routes that end in /Roles to post (to add) a new Role
// ---------------------------------------------------------------------

roleRoutes.route('/')
	.post(function(req, res) {

		Role.forge({
			name: req.body.name,
		})
		.save()
		.then( model => res.json({error: false, data:{model}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
	});


// on routes that end in /Roles/:id to delete an Role
// ---------------------------------------------------------------------

roleRoutes.route('/:id')
	.delete(function(req, res){
		Role.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(model){
			model.destroy()
				.then( () => res.json({error: true, data: {message: 'Role model successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
	});
