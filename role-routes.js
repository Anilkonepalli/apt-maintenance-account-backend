var _ 			= require('lodash'),
	express 	= require('express'),
	Role 		= require('./models/role'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var Roles = Bookshelf.Collection.extend({
	model: Role
});

// application routing
var roleRoutes = module.exports = express.Router();


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
	//next(); // make sure we go to the next routes and don't stop here
});


// on routes that end in /Roles
// ---------------------------------------------------------------------
roleRoutes.route('/')
	// get all the Role records (accessed at GET http://localhost:3002/api/Roles)
	.get(function(req, res){
		Roles.forge().fetch()
			.then(records => res.json(records))
			.catch(err => res.send(err));
	});

// on routes that end in /Roles/:id to get an Role
// ---------------------------------------------------------------------
roleRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new Role
			res.json(new Role());
		} else { // respond with fetched Role
			Role.forge( {id: req.params.id} ).fetch()
				.then(record => res.json(record))
				.catch(err => res.send(err));
		}
	});
// on routes that end in /Roles/:id to update an existing Role
// ---------------------------------------------------------------------
roleRoutes.route('/:id')
	.put(function(req, res) {
		Role.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(Role){
			Role.save({
				name: req.body.name || Role.get('name')
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

// on routes that end in /Roles to post (to add) a new Role
// ---------------------------------------------------------------------

roleRoutes.route('/')
	.post(function(req, res) {
		console.log('New Role being added...');
		console.log(req.body);
		console.log(req.query);

		Role.forge({
			name: req.body.name,
		})
		.save()
		.then( aRole => res.json({error: false, data:{aRole}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
	});


// on routes that end in /Roles/:id to delete an Role
// ---------------------------------------------------------------------

roleRoutes.route('/:id')
	.delete(function(req, res){
		Role.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(aRole){
			aRole.destroy()
				.then( () => res.json({error: true, data: {message: 'Role successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
	});
