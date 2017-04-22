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
console.log('Sorted Models: '); console.log(sortedModels);
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
console.log('model to be saved...')		; console.log(req.body);
		return MaintenanceAccount.forge({
			item: req.body.item,
			name: req.body.name,
			flat_number: req.body.flat_number,
			for_month: req.body.for_month,
			for_year: req.body.for_year,
			crdr: req.body.crdr,
			amount: req.body.amount,
			category: req.body.category,
			recorded_at: req.body.recorded_at,
			remarks: req.body.remarks
		}).save();
	}

/*

function updateBalance(model){

	//console.log('Saved posted account...'); console.log(model);
	jmodel = model.toJSON();
	console.log('jmodel is...'); console.log(jmodel);
	MaintenanceAccounts
		.fetch()
		.then(processAll)
		.catch(sendError);

		function processAll(models) {
			calculateBalanceAndApply(models, jmodel); // external function
			return new Promise(function(resolve, reject){
				1 > 0 ? resolve(model) : reject(new Error('Cannot calc balance'));
			});
		}

		function sendError(err) {
			logger.log('error', err.message);
			return res.status(500).json({error: true, data: {message: err.message}});
		}

}

 */

	function updateBalance(model){

		//console.log('Saved posted account...'); console.log(model);
		jmodel = model.toJSON();
		console.log('jmodel is...'); console.log(jmodel);
		jmodels=[];

		MaintenanceAccounts
			.query('where', 'recorded_at', '=', jmodel.recorded_at)
			.orderBy('id', 'ASC')
			.fetch()
			.then(getModelsBeforeRecordDate)
			.then(getModelsAfterRecordDate)
			.then(processAll)
			.then(sendResponse)
			.catch(sendError);

			function getModelsBeforeRecordDate(models) {
				jmodels = jmodels.concat( models.toJSON() );
console.log('jmodels On Record Date'); console.log(jmodels);
				return MaintenanceAccounts
					.query('where', 'recorded_at', '<', jmodel.recorded_at)
					.orderBy('recorded_at', 'DESC')
					.orderBy('id', 'DESC')
					.fetchOne();
			}

			function getModelsAfterRecordDate(models) {
				if(models){  // if models is not null
					jmodels = jmodels.concat( models.toJSON() );
console.log('jmodels Before Record Date'); console.log( models.toJSON() );
				} else {
console.log('no models before record date');					
				}

				return MaintenanceAccounts
					.query('where', 'recorded_at', '>', jmodel.recorded_at)
					.orderBy('recorded_at', 'ASC')
					.orderBy('id', 'ASC')
					.fetch();
			}

			function processAll(models) {
				jmodels = jmodels.concat( models.toJSON() );
console.log('jmodels After Record Date'); console.log( models.toJSON() );
				calculateBalanceAndApply(jmodels, model);
				return new Promise(function(resolve, reject){
					1 > 0 ? resolve(true) : reject(new Error('Cannot calc balance'));
				});
			}

			function sendResponse(models) {
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

// private function
// Sorts the models first, to start applying balance
// find index of the jmodel if supplied;
// get balance from index - 1 model, use it to calculate balance for
// remaining models in the sorted list
// Note: If jmodel is null, then balance
// will start from first element in the sortedModels;
function calculateBalanceAndApply(models, jmodel=NULL) {
console.log('No. of models fetched...'); console.log(models.length);
	//let jmodels = models.toJSON();
	let jmodels = models;
console.log('fetched models are: '); console.log(jmodels);

	let sortedModels = _.sortBy(jmodels, [
			function(model){ return model.recorded_at; }, // sort criteria 1
			function(model){ return model.id;	}						// sort criteria 2
		]);

	let indx = jmodel
		? _.findIndex(sortedModels, (o) => o.id === jmodel.id)
		: 0; // if null, set indx to 0

console.log('indx for assessing current balance = '+indx);
	let currBal = 0;
	if(indx > 0) { // if jmodel is not the first element in the sortedModels
		bal = sortedModels[indx-1].balance; // previous account record's balance
		currBal = bal?bal:0; // if bal is null, then set it to 0
	}

	for(i=indx; i < sortedModels.length; i++){ // calculate new balance and apply

		let acct = sortedModels[i];

		if(acct.crdr === 'cr'){ currBal = currBal + acct.amount; }
		else if (acct.crdr === 'dr') {  currBal = currBal - acct.amount; }
		else { throw new Error('Invalid crdr found');	}

		new MaintenanceAccount({id: acct.id})
			.save({balance: currBal}, {patch: true}) // save the balance into database
			.then( (model) => {
				let obj = model.toJSON();
				console.log('Model id '+obj.id+' is updated with balance: '+obj.balance);
			})
			.catch( (err) => {
				console.error('Error while updating account with balance: '+err.message);
			});
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
