var _ 			= require('lodash');
var	express 	= require('express');
var	jwt			= require('jsonwebtoken');

var	constants	= require('../config/constants');
var	Bookshelf 	= require('../config/database');
var	MaintenanceAccount 		= require('./maint-acct-model');
var auth = require('../authorization/authorization');

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
	// get all the maintenance account models 
	// (accessed at GET http://localhost:3002/api/maintenance-accounts)
	.get(function(req, res){
		MaintenanceAccounts
			.forge()
			.fetch()
			.then(doAuth)
			.then(models => res.json(models))
			.catch(sendError);

		function doAuth(models) {
			return auth.allowedList(req.decoded.id, 'accounts', models);
		}

		function sendError(err) {
			return res.status(500).json({error: true, data: {message: err.message}});
		}

	});

// on routes that end in /maintenance-accounts/:id to get an account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new account model
			auth.allowsAdd(req.decoded.id, 'accounts') // is authorized to add ?
				.then(granted => res.json(new MaintenanceAccount()))
				.catch(sendError);
		} else { // respond with fetched account model
			MaintenanceAccount
				.forge( {id: req.params.id} )
				.fetch()
				.then(doAuth) // is authorized to view?
				.then(model => res.json(model))
				.catch(sendError);
		}
		function doAuth(model) {
			return auth.allowsView(req.decoded.id, 'accounts', model);
		}
		function sendError(err) {
			return res.status(500).json({error: true, data: {message: err.message}});
		}

	});
// on routes that end in /maintenance-accounts/:id to update an existing account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.put(function(req, res) {

		MaintenanceAccount
			.forge({id: req.params.id})
			.fetch({require: true})
			.then(doAuth)
			.then(doUpdate)
			.then(sendResponse)
			.catch(sendError);

		function doAuth(model) {
			return auth.allowsEdit(req.decoded.id, 'accounts', model);
		}
		function doUpdate(model){
			return model.save({
				name: req.body.name || model.get('name')
			});
		}
		function sendResponse() {
			return res.json({error: false, data:{message: 'Account Details Updated'}});
		}
		function sendError(err) {
			return res.status(500).json({error: true, data: {message: err.message}});
		}

	});

// on routes that end in /maintenance-accounts to post (to add) a new account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/')
	.post(function(req, res) {
		auth.allowsAdd(req.decoded.id, 'accounts')
			.then(doSave)
			.then(sendResponse)
			.catch(sendError);

		function doSave(granted) {
			return MaintenanceAccount.forge({
				name: req.body.name
			}).save()
		}
		function sendResponse(model) {
			return res.json({error: false, data:{model}});
		}
		function sendError(err) {
			return res.status(500).json({error: true, data: {message: err.message}});
		}

	});


// on routes that end in /maintenance-accounts/:id to delete an account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/:id')
	.delete(function(req, res){
		MaintenanceAccount
			.forge({id: req.params.id})
			.fetch({require: true})
			.then(doAuth)
			.then(doDelete)
			.then(sendResponse)
			.catch(sendError);

		function doAuth(model) {
			return auth.allowsDelete(req.decoded.id, 'accounts', model);
		}
		function doDelete(model){
			return model.destroy(); 
		}
		function sendResponse() {
			return res.json({error: false, data:{message: 'Account Details Successfully Deleted'}});
		}
		function sendError(err) {
			return res.status(500).json({error: true, data: {message: err.message}});
		}

	});

