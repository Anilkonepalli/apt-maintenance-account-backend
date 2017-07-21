var	Bookshelf 					= require('../config/database');
var	MaintenanceAccount 	= require('./maint-acct-model');
var auth 								= require('../authorization/authorization');
var _ 									= require('lodash');
var constants 					= require('../config/constants.json');

var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});


// more routes for the API will happen here

// on routes that end in /maintenance-accounts
// ---------------------------------------------------------------------
function getAll(req, res) {
	let fromDate = new Date(req.query.fromDate).toISOString().split('T')[0];
	let toDate = new Date(req.query.toDate).toISOString().split('T')[0];
	logger.log('debug', 'from date string format: '); logger.log('debug', fromDate);
	logger.log('debug', 'to date string format: '); logger.log('debug', toDate);

	MaintenanceAccounts
		.query('where', 'recorded_at', '>=', fromDate)
		.query('where', 'recorded_at', '<=', toDate)
		.fetch()
		.then(doAuth)
		.then(sendResponse)
		.catch(sendError);

	function doAuth(models) {
		logger.log('debug', '/api/maintenance-accounts >> getAll()...');
		return auth.allowedList(req.decoded.id, 'accounts', models.toJSON());
	}

	// sends Account models after sorting; sorting is based on its recorded_at field and then id field
	function sendResponse(models) {
		logger.log('debug', 'maint-acct-routes >>getAll()...sendResponse(models)... ');
		// logger.log('debug', models);
		let sortedModels = _.sortBy(models, [
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
		logger.log('debug', '/api/maintenance-accounts >> get()...');
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

		let attributesChanged = '';
		let modelCopy = model.clone();
		model.on('saving', (obj) => {

			if ( obj.hasChanged('crdr') ) {
				attributesChanged += 'crdr';
			}
			if ( obj.hasChanged('amount') ) {
				attributesChanged += attributesChanged ? ', ' : '' ;
				attributesChanged += 'amount';
			}
			if ( obj.hasChanged('recorded_at') ) {
				attributesChanged += attributesChanged ? ', ' : '' ;
				attributesChanged += 'recorded_at';
				oldRecordDate = model._previousAttributes.recorded_at;
				newRecordDate = model.attributes.recorded_at;
				logger.log('debug', 'Old Record Date is: '+oldRecordDate+'; New Record date is: '+newRecordDate);
				if(oldRecordDate < newRecordDate) {
					logger.log('debug', 'Old Record Date is earlier; hence start balance calc from this old record date');
					modelCopy.attributes.recorded_at = oldRecordDate;
					logger.log('debug', 'model used for update is: '); logger.log('debug', modelCopy);
				} else {
					modelCopy.attributes.recorded_at = newRecordDate;
				}
			}

		});

		model.on('saved', (obj) => {
			if(attributesChanged){
				logger.log('debug', "model's attribute(s) "+attributesChanged+' is/are changed');
				logger.log('debug', 'model copy is: '); logger.log('debug', modelCopy);
				updateBalance(modelCopy);
			}
		});

		logger.log('debug', '/api/maintenance-accounts >> put()...');
		return model.save({
			item: req.body.item || model.get('item'),
			name: req.body.name || model.get('name'),
			flat_number: req.body.flat_number || model.get('flat_number'),
			for_month: req.body.for_month || model.get('for_month'),
			for_year: req.body.for_year || model.get('for_year'),
			crdr: req.body.crdr || model.get('crdr'),
			amount: req.body.amount || model.get('amount'),
			recorded_at: req.body.recorded_at || model.get('recorded_at'),
			owner_id: req.body.owner_id || model.get('owner_id')
		});
	}
	function sendResponse(model) {
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
		.then(getTotalForMaxCheck)
		.then(doSave)
		.then(setBalance)
		.then(sendResponse)
		.catch(sendError);

	function getTotalForMaxCheck(granted) {
		let tableName = MaintenanceAccount.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.log('debug', 'Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.log('debug', 'Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function doSave(total) {
		if(total && total[0].CNT >= constants.maxRecords.accounts) {
			let msg = 'Maximum Limit Reached! Cannot Save Account details!';
			logger.log('error', msg);
			throw new Error(msg);
		}
		logger.log('debug', '/api/maintenance-accounts >> post()->doSave(..)');
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
			remarks: req.body.remarks,
			owner_id: req.body.owner_id
		}).save();
	}
	function setBalance(model) {
		return updateBalance(model); // a private functions shared between post and put calls
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
		logger.log('debug', '/api/maintenance-accounts >> del()...');
		let modelCopy = model.clone();  // after model deletion, it cannot be accesses, so clone it
		model.on('destroying', (obj) => {
			logger.log('debug', "Triggered balance re-calculation on removel of this model");
			updateBalance(modelCopy);
		});
		return model.destroy();
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Account Details Successfully Deleted'}});
	}
	function sendError(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /maintenance-accounts/summary/list
// ---------------------------------------------------------------------
function getSummaries(req, res) {

	MaintenanceAccount
		.fetchAll()
		.then(doAuth)
		.then(sendResponse)
		.catch(sendError);

	function doAuth(models) {
		logger.log('debug', '/api/maintenance-accounts >> getSummaries()...');
		return auth.allowsView(req.decoded.id, 'account-summary', models.toJSON());
	}

	// sends Account models after sorting; sorting is based on its recorded_at field and then id field
	function sendResponse(models) {
		logger.log('debug', 'maint-acct-routes >>getSummaries()...sendResponse(models)... ');
		//logger.log('debug', models);
		let summaries = {};
		let summary;
		let key;
		let crdr;
		let totalDiff = 0; // initial amount is zero
		let result = [];
		let prefix = '';
		models.forEach(each => {
			prefix = each.for_month < 10 ? '0' : '';
			key = each.for_year + '-' + prefix + each.for_month; // eg: 2017-01
			if(! summaries[key]){
				summaries[key] = {cr: 0, dr: 0, diff: 0, cumulativeDiff: 0};
			}
			summary = summaries[key];
			crdr = each.crdr.toLowerCase();
			if(crdr === 'cr') summary.cr += each.amount;
			if(crdr === 'dr') summary.dr += each.amount;
		});
		Object.keys(summaries).forEach(each => {
			summary = summaries[each];
			summary.diff = summary.cr - summary.dr;
			summary.cumulativeDiff = summary.diff + totalDiff;
			totalDiff += summary.diff;
			summary['yr_mo'] = each;
			result.push(summary);
		});
		return res.json(result);
	}

	function sendError(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

/**   Private Function
 * First retrieve record for balance; record previous to added/updated/deleted record
 * is retrieved to know balance and apply it to subsequent records.
 * If no previous record is found, balance is taken as 0 (zero); that means entire records
 * need a balance recalcuation.
 * Now, retrieve records dated later to record retrieved for balance.
 * Order the records based on two criteria: a) recorded_at b) id fields
 * @param  {[type]} model
 * @return {[type]} Promise
 */

function updateBalance(model) {
	jmodel = model.toJSON();
	jmodels = [];
	currentBalance = 0;
	logger.log('debug','=========================== Update Balance Starts ===================================');
	logger.log('debug', 'Update balance in progress....jmodel recorded_at: '+jmodel.recorded_at);
	return MaintenanceAccounts
		.query('where', 'recorded_at', '<', jmodel.recorded_at)
		.orderBy('recorded_at', 'DESC')
		.orderBy('id', 'DESC')
		.fetchOne()
		.then(getModelsAddedOnLaterDate)
		.then(processAll)
		.then(sendResponse)
		.catch(sendError);

		function getModelsAddedOnLaterDate(prevModel){
			let modelForBalance = null;
			logger.log('debug','Previous model is: '); logger.log('debug', prevModel);
			if(prevModel) {
				recordDate = prevModel.attributes.recorded_at;
				currentBalance = prevModel.attributes.balance;
				logger.log('debug','Retrieval based on Record Date: '+recordDate);
				logger.log('debug','Current Balance as: '+currentBalance);
				return MaintenanceAccounts
					.query('where', 'recorded_at', '>', recordDate)
					.fetch();
			} else {
				logger.log('debug', 'No prevous model; hence, retrieving all records...');
				return MaintenanceAccount.fetchAll();
			}
		}
		function processAll(models) {
			let jmodels = models.toJSON();
			let smodels = _.sortBy(jmodels, [
					(model) => model.recorded_at, // sort criteria 1
					(model) => model.id						// sort criteria 2
				]);
			logger.log('debug', smodels.length+' records undergo balance update' );
			logger.log('debug', 'using current balance as: '+currentBalance);
			return calculateBalanceAndApply(smodels, currentBalance);
		}
		function sendResponse(models) {
			logger.log('debug','============================= Update Balance Ends =================================');
			return new Promise(function(resolve, reject){
				1 > 0 ? resolve(model) : reject(new Error('Cannot calc balance'));
			});
		}
		function sendError(err) {
			logger.log('error', err.message);
			logger.log('debug','============================ Update Balance Ends with Errors ==================================');
			return res.status(500).json({error: true, data: {message: err.message}});
		}
}


// private function
/**
 * Iterate each elements in the jmodels; for the initial balance, use currentBalance
 * @param  {[MaintenanceAccounts]} jmodels
 * @param  {Number} currentBalance
 * @return {[Promises]}
 */
function calculateBalanceAndApply(jmodels, currentBalance) {

	let currBal = currentBalance;
	let promises = [];
	let aPromise;

	for(i=0; i < jmodels.length; i++){ // calculate new balance and apply
		let acct = jmodels[i];
		let crdr = acct.crdr.toLowerCase();
		currBal += (crdr === 'cr') ? acct.amount : 0;
		currBal -= (crdr === 'dr') ? acct.amount : 0;
		aPromise = new MaintenanceAccount({id: acct.id})
			.save({balance: currBal}, {patch: true}); // save the balance into database
		promises.push(aPromise);
	}
	return Promise.all(promises);
}

module.exports = { getAll, post, get, put, del, getSummaries };
