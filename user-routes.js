var _ 			= require('lodash'),
	express 	= require('express'),
	User 		= require('./models/user'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var Users = Bookshelf.Collection.extend({
	model: User
});

// application routing
var userRoutes = module.exports = express.Router();


// api routes

// middleware to use for all requests
userRoutes.use(function(req, res, next){
	// do logging
	console.log('User Access is happening...');

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
			message: 'No token provided in UserRoutes.'
		});
	}
	//next(); // make sure we go to the next routes and don't stop here
});


// on routes that end in /users
// ---------------------------------------------------------------------
userRoutes.route('/')
	// get all the user models (accessed at GET http://localhost:3002/api/users)
	.get(function(req, res){
		Users.forge().fetch()
			.then(models => res.json(models))
			.catch(err => res.send(err));
	});

// on routes that end in /users/:id to get an user
// ---------------------------------------------------------------------
userRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new user model
			res.json(new User());
		} else { // respond with fetched user model
			User.forge( {id: req.params.id} ).fetch()
				.then(model => res.json(model))
				.catch(err => res.send(err));
		}
	});

// on routes that end in /Users/myroles/:id to get an User with associated roles
// ---------------------------------------------------------------------
userRoutes.route('/myroles/:id')
	.get(function(req, res) {
console.log('req.params...');console.log(req.params);
		User.forge( {id: req.params.id} ).fetch({withRelated: ['roles']})
			.then(model => {
console.log('model is...'); console.log(model.toJSON());
				let modelJson = model.toJSON();
console.log('my Roles are:....'); console.log(modelJson.roles); 
				res.json(modelJson.roles); 
			})
			.catch(err => res.send(err));
	});



// on routes that end in /users/:id to update an existing user
// ---------------------------------------------------------------------
userRoutes.route('/:id')
	.put(function(req, res) {
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

	});


// on routes that end in /roles/myroles/:id to update an existing User with myroles
// --------------------------------------------------------------------------------------------
userRoutes.route('/myroles/:id')
	.put(function(req, res) {
		User.forge({id: req.params.id}).fetch({require: true, withRelated:['roles']})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(model){
console.log('attaching my roles...');
console.log(req.body.myrolesIds);
			model.roles().detach().then( // remove the existing roles first
				model.roles().attach(req.body.myrolesIds)); // attach new roles
			res.json({error:false, data:{ message: 'My Roles are attache'}});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

	});



// on routes that end in /users to post (to add) a new user
// ---------------------------------------------------------------------

userRoutes.route('/')
	.post(function(req, res) {
		console.log('New user being added...');
		console.log(req.body);
		console.log(req.query);

		User.forge({
			name: req.body.name,
		})
		.save()
		.then( model => res.json({error: false, data:{model}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
	});


// on routes that end in /users/:id to delete an user
// ---------------------------------------------------------------------

userRoutes.route('/:id')
	.delete(function(req, res){
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
	});
