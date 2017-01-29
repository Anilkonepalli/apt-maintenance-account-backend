var _ 			= require('lodash'),
	express 	= require('express'),
	Permission 		= require('./models/permission'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var Permissions = Bookshelf.Collection.extend({
	model: Permission
});

// application routing
var permissionRoutes = module.exports = express.Router();


// api routes

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
	//next(); // make sure we go to the next routes and don't stop here
});


// on routes that end in /Permissions
// ---------------------------------------------------------------------
permissionRoutes.route('/')
	// get all the permission records (accessed at GET http://localhost:3002/api/Permissions)
	.get(function(req, res){
		Permissions.forge().fetch()
			.then(records => res.json(records))
			.catch(err => res.send(err));
	});

// on routes that end in /Permissions/:id to get an permission
// ---------------------------------------------------------------------
permissionRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new permission
			res.json(new Permission());
		} else { // respond with fetched permission
			Permission.forge( {id: req.params.id} ).fetch()
				.then(record => res.json(record))
				.catch(err => res.send(err));
		}
	});
// on routes that end in /Permissions/:id to update an existing permission
// ---------------------------------------------------------------------
permissionRoutes.route('/:id')
	.put(function(req, res) {
		Permission.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(permission){
			permission.save({
				resource: req.body.resource || permission.get('resource')
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

	});

// on routes that end in /Permissions to post (to add) a new permission
// ---------------------------------------------------------------------

permissionRoutes.route('/')
	.post(function(req, res) {
		console.log('New permission being added...');
		console.log(req.body);
		console.log(req.query);

		Permission.forge({
			resource: req.body.resource,
		})
		.save()
		.then( record => res.json({error: false, data:{record}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
	});


// on routes that end in /Permissions/:id to delete an permission
// ---------------------------------------------------------------------

permissionRoutes.route('/:id')
	.delete(function(req, res){
		Permission.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(record){
			record.destroy()
				.then( () => res.json({error: true, data: {message: 'Permission successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
	});
