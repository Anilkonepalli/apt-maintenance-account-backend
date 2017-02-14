var _ 			= require('lodash'),
	express 	= require('express'),
	MaintenanceAccount 		= require('./models/maint-acct'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants');
//	bcrypt 		= require('bcrypt');
	
var getPermissions = require('./user-permissions');
var auth = require('./authorization');

var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});

// application routing
var maintAcctRoutes = module.exports = express.Router();


// middleware to use for all requests
maintAcctRoutes.use(function(req, res, next){
	// do logging
	console.log('Maintenance Account Access is happening...');

	let token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if(token) {
		// verifies secret and checks exp
		jwt.verify(token, constants.secret, function(err, decoded){
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token'});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				//getPermissions(decoded.id); // test retrieval of permissions for user id
				next();
			}
		});
	} else {
		// if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided in MaintAcctRoutes.'
		});
	}

});

// more routes for the API will happen here

// on routes that end in /maintenance-accounts
// ---------------------------------------------------------------------
maintAcctRoutes.route('/')
	// get all the maintenance account models (accessed at GET http://localhost:3002/api/maintenance-accounts)
	.get(function(req, res){
		MaintenanceAccounts.forge().fetch()
			.then(models => res.json(models))
			.catch(err => res.send(err));
	});

// on routes that end in /maintenance-accounts/:id to get an account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new account model
			res.json(new MaintenanceAccount());
		} else { // respond with fetched account model
			MaintenanceAccount.forge( {id: req.params.id} ).fetch()
				.then(model => res.json(model))
				.catch(err => res.send(err));
		}
	});
// on routes that end in /maintenance-accounts/:id to update an existing account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.put(function(req, res) {
		MaintenanceAccount.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(model){
			model.save({
				name: req.body.name || model.get('name')
			})
			.then(function(){
				res.json({error: false, data:{message: 'Account Details Updated'}});
			})
			.catch(function(err){
				res.status(500).json({error: true, data: {message: err.message}});
			});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

	});

// on routes that end in /maintenance-accounts to post (to add) a new account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/')
	.post(function(req, res) {

		auth.allowsAdd(req.decoded.id, 'accounts')
			.then( granted => {
				MaintenanceAccount.forge({
					name: req.body.name,
				})
				.save()
				.then( (model) => res.json({error: false, data:{model}}))
				.catch( (err) => {
					return res.status(500).json({error: true, data:{message: err.message}});
				});
			})
			.catch(err => {
				return res.status(500).json({error: true, data:{message: err}});
			});

	});


// on routes that end in /maintenance-accounts/:id to delete an account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/:id')
	.delete(function(req, res){
		MaintenanceAccount.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(model){
			model.destroy()
				.then( () => res.json({error: true, data: {message: 'Account Model successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
	});

