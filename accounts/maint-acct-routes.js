var	Bookshelf 			= require('../config/database');
var	MaintenanceAccount 	= require('./maint-acct-model');
var auth 				= require('../authorization/authorization');

var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});


// more routes for the API will happen here

// on routes that end in /maintenance-accounts
// ---------------------------------------------------------------------
function getAll(req, res) {
	MaintenanceAccounts
		.forge()
		.fetch()
		.then(doAuth)
		.then(models => res.json(models))
		.catch(sendError);

	function doAuth(models) {
		logger.log('info', '/api/maintenance-accounts >> getAll()...');
		return auth.allowedList(req.decoded.id, 'accounts', models);
	}

	function sendError(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /maintenance-accounts/:id to get an account
// ---------------------------------------------------------------------
function get(req, res) {
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
		logger.log('info', '/api/maintenance-accounts >> get()...');
		return auth.allowsView(req.decoded.id, 'accounts', model);
	}
	function sendError(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}
// on routes that end in /maintenance-accounts/:id to update an existing account
// ---------------------------------------------------------------------
function put(req, res) {
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
		logger.log('info', '/api/maintenance-accounts >> put()...');
		return model.save({
			item: req.body.item || model.get('item'),
			name: req.body.name || model.get('name'),
			flat_number: req.body.flat_number || model.get('flat_number'),
			for_month: req.body.for_month || model.get('for_month')
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Account Details Updated'}});
	}
	function sendError(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /maintenance-accounts to post (to add) a new account
// ---------------------------------------------------------------------
function post(req, res) {
	auth.allowsAdd(req.decoded.id, 'accounts')
		.then(doSave)
		.then(sendResponse)
		.catch(sendError);

	function doSave(granted) {
		logger.log('info', '/api/maintenance-accounts >> post()...');
		return MaintenanceAccount.forge({
			item: req.body.item,
			name: req.body.name,
			flat_number: req.body.flat_number,
			for_month: req.body.for_month
		}).save()
	}
	function sendResponse(model) {
		return res.json({error: false, data:{model}});
	}
	function sendError(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /maintenance-accounts/:id to delete an account
// ---------------------------------------------------------------------
function del(req, res) {
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
		logger.log('info', '/api/maintenance-accounts >> del()...');
		return model.destroy();
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Account Details Successfully Deleted'}});
	}
	function sendError(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

module.exports = { getAll, post, get, put, del };
