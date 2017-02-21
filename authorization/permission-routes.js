//var	express 	= require('express');
//var	jwt			= require('jsonwebtoken');

var	Permission 	= require('./permission-model');
var	Bookshelf 	= require('../config/database');
//var	constants	= require('../config/constants');

var Permissions = Bookshelf.Collection.extend({
	model: Permission
});

// application routing
//var permissionRoutes = module.exports = express.Router();


// api routes

/*
// middleware to use for all requests
permissionRoutes.use(function(req, res, next){
	// do logging
	console.log('Permission Access is happening...');

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
			message: 'No token provided in permissionRoutes.'
		});
	}

});

*/

// on routes that end in /Permissions
// ---------------------------------------------------------------------
/*
permissionRoutes.route('/')
	// get all the permission models (accessed at GET http://localhost:3002/api/Permissions)
	.get(function(req, res){
*/
function getAll(req, res) {
		Permissions.forge().fetch()
			.then(models => res.json(models))
			.catch(err => res.send(err));
//	});
}

/*
// on routes that end in /Permissions/:id to get an permission
// ---------------------------------------------------------------------
permissionRoutes.route('/:id')
	.get(function(req, res) {
*/
function get(req, res) {
		if(req.params.id === '0') { // respond with a new permission model
			res.json(new Permission());
		} else { // respond with fetched permission model
			Permission.forge( {id: req.params.id} ).fetch()
				.then(model => res.json(model))
				.catch(err => res.send(err));
		}
//	});
}

/*
// on routes that end in /Permissions/:id to update an existing permission
// ---------------------------------------------------------------------
permissionRoutes.route('/:id')
	.put(function(req, res) {
*/
function put(req, res) {
		Permission.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(model){
			model.save({
				resource: req.body.resource || model.get('resource')
			})
			.then(function(){
				res.json({error: false, data:{message: 'Permission Details Updated'}});
			})
			.catch(function(err){
				res.status(500).json({error: true, data: {message: err.message}});
			});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
//	});
}

// on routes that end in /Permissions to post (to add) a new permission
// ---------------------------------------------------------------------
/*
permissionRoutes.route('/')
	.post(function(req, res) {
*/
function post(req, res) {
		Permission.forge({
			resource: req.body.resource,
		})
		.save()
		.then( model => res.json({error: false, data:{model}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
//	});
}

// on routes that end in /Permissions/:id to delete an permission
// ---------------------------------------------------------------------
/*
permissionRoutes.route('/:id')
	.delete(function(req, res){
*/
function del(req, res) {
		Permission.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(model){
			model.destroy()
				.then( () => res.json({error: true, data: {message: 'Permission model successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
//	});
}

module.exports = { getAll, post, get, put, del };