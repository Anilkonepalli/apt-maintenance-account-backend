var	Bookshelf 			= require('../config/database');
var	MaintenanceAccount 	= require('./maint-acct-model');
var auth 				= require('../authorization/authorization');
var _ 					= require('lodash');

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
//		.then(models => res.json(models))
		.then(sendResponse)
		.catch(sendError);

	function doAuth(models) {
		logger.log('info', '/api/maintenance-accounts >> getAll()...');
		return auth.allowedList(req.decoded.id, 'accounts', models);
	}

	// sends Account models after sorting; sorting is based on its recorded_at field and then id field
	function sendResponse(models) {
		let sortedModels = _.sortBy(models.toJSON(), [
				function(model){ return model.recorded_at; }, // sort criteria 1
				function(model){ return model.id;	}						// sort criteria 2
			]);
		res.json(sortedModels);
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
			for_month: req.body.for_month || model.get('for_month'),
			for_year: req.body.for_year || model.get('for_year'),
			crdr: req.body.crdr || model.get('crdr'),
			amount: req.body.amount || model.get('amount'),
			recorded_at: req.body.recorded_at || model.get('recorded_at')
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
		.then(updateBalance)
		.then(sendResponse)
		.catch(sendError);

	function doSave(granted) {
		logger.log('info', '/api/maintenance-accounts >> post()...');
		return MaintenanceAccount.forge({
			item: req.body.item,
			name: req.body.name,
			flat_number: req.body.flat_number,
			for_month: req.body.for_month,
			for_year: req.body.for_year,
			crdr: req.body.crdr,
			amount: req.body.amount,
			recorded_at: req.body.recorded_at
		}).save();
	}
	function updateBalance(model){
		console.log('Saved posted account...'); console.log(model);

		MaintenanceAccounts
			.forge()
			.fetch()
			.then(sortIterateApplyBalance)
			.catch(sendError);

			// sort on fetched models
			// find index of the model in the sorted models
			// get balance from index - 1 model, use it to calculate balance for remaining
			// models in the sorted list
			function sortIterateApplyBalance(models) {
				let sortedModels = _.sortBy(models.toJSON(), [
						function(model){ return model.recorded_at; }, // sort criteria 1
						function(model){ return model.id;	}						// sort criteria 2
					]);
				let indx = _.findIndex(sortedModels, function(o){ return o.recorded_at === model.recorded_at; });
				let currentBalance = sortedModels[indx-1].balance; // previous account record's balance
				for(i=indx; i < sortedModels.length; i++){
					let acct = sortedModels[i];
					currentBalance = currentBalance + acct.amount;
console.log('Current Balance: '+currentBalance);
					acct.balance = currentBalance;
					acct.save();
				}
				return new Promise(function(resolve, reject){
					1 > 0 ? resolve(model) : reject(new Error('Cannot calc balance'));
				});
			}

			function sendError(err) {
				logger.log('error', err.message);
				return res.status(500).json({error: true, data: {message: err.message}});
			}

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

/*
// get latest balance
function getLatestBalance(granted) {
	logger.log('info', 'maint-acct-routes >> getLatest()...');

	MaintenanceAccounts
		.forge()
		.fetch()
		.then(sendLatestBalance)
		.catch(sendError);

	// sends balance of last record in the sorted models
	function sendLatestBalance(models) {
		let sortedModels = _.sortBy(models.toJSON(), [
				function(model){ return model.recorded_at; }, // sort criteria 1
				function(model){ return model.id;	}						// sort criteria 2
			]);
console.log('get latest balance from sorted models...'); console.log(sortedModels);
			return new Promise(function(resolve, reject) {
				let total = sortedModels.length;
				total > 0
					? resolve(sortedModels[total-1].balance)
					: reject(0); // no latest account, so no balance or Zero balance
			});
	}

	function sendError(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}
*/

module.exports = { getAll, post, get, put, del };
