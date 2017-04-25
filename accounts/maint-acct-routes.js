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

		let attributesChanged = '';
		model.on('saving', (obj) => {

			if ( obj.hasChanged('crdr') ) {
				attributesChanged += 'crdr';
			}
			if( obj.hasChanged('amount') ) {
				attributesChanged += attributesChanged ? ', ' : '' ;
				attributesChanged += 'amount';
			}
			if ( obj.hasChanged('recorded_at') ) {
				attributesChanged += attributesChanged ? ', ' : '' ;
				attributesChanged += 'recorded_at';
			}

		});

		model.on('saved', (obj) => {
			if(attributesChanged){
				logger.log('info', "model's attribute(s) "+attributesChanged+' is/are changed');
				updateBalance(model, 'updated');
			}
		});

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
	function sendResponse(model) {
console.log('updated model...'); console.log(model);
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
		.then(setBalance)
		.then(sendResponse)
		.catch(sendError);

	function doSave(granted) {
		logger.log('info', '/api/maintenance-accounts >> post()->doSave(..)');
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
	function setBalance(model) {
		return updateBalance(model, 'added'); // a private functions shared between post and put calls
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
		let modelCopy = model.clone();  // after model deletion, it cannot be accesses, so clone it
		model.on('destroying', (obj) => {
			logger.log('info', "Triggered balance re-calculation on removel of this model");
			updateBalance(modelCopy, 'deleted');
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


/**   Private Function
 * Balance is calculated after sorting the records;
 * sorting is based on two fields: recorded_at, id.
 * In the sorted list, this posted new record can be a first record,
 * between existing records, or in the end of the list.
 * To minimize performance hit, only necessary records are retrieved first,
 * then sorted out.  Three set of records are retrieved based on recorded_at date
 * of the posted new record:
 * 	a) records with same 'recorded_at' date  ** it can retrieve 0 to n records
 * 	b) only one record previous to 'recorded_at' date  ** it is to get its Balance
 * 	c) records with date after 'recorded_at' date ** it can be 0 to 'all' records
 * Join all the retrieved records; sort them as per two criteria mentioned above.
 * Determine index of the posted new record within the sorted list.
 * Fetch (index - 1) record to get its balance.  Use it to calculate balance of
 * the posted new record.  Use this balance, in turn, to other following records.
 * @param  {[type]} model
 * @return {[type]} Promise
 */
function updateBalance(model, action){

	jmodel = model.toJSON();
	jmodels=[];

	return MaintenanceAccounts
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
			logger.log('info', 'Record Date has already '+jmodels.length+' records');
			return MaintenanceAccounts
				.query('where', 'recorded_at', '<', jmodel.recorded_at)
				.orderBy('recorded_at', 'DESC')
				.orderBy('id', 'DESC')
				.fetchOne();
		}
		function getModelsAfterRecordDate(models) {
			if(models){  // if models is not null
				jmodels = jmodels.concat( models.toJSON() );
				logger.log('info', 'One record before Record Date is retrieved');
			} else {
				logger.log('info', 'No models before record date');
			}
			return MaintenanceAccounts
				.query('where', 'recorded_at', '>', jmodel.recorded_at)
				.orderBy('recorded_at', 'ASC')
				.orderBy('id', 'ASC')
				.fetch();
		}
		function processAll(models) {
			jmodels = jmodels.concat( models.toJSON() );
			logger.log('info', 'After Record Date has '+models.toJSON().length+' records' );
			return calculateBalanceAndApply(jmodels, model, action);
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

// private function
// Sorts the models first, to start applying balance
// find index of the jmodel if supplied;
// get balance from index - 1 model, use it to calculate balance for
// remaining models in the sorted list
// Note: If jmodel is null, then balance
// will start from first element in the sortedModels;
function calculateBalanceAndApply(jmodels, jmodel=NULL, action) {
	console.log('No. of models fetched...'); console.log(jmodels.length);
	console.log('fetched models are: '); console.log(jmodels);

	let smodels = _.sortBy(jmodels, [
			(model) => model.recorded_at, // sort criteria 1
			(model) => model.id						// sort criteria 2
		]);

	let indx = jmodel
		? _.findIndex(smodels, (o) => o.id === jmodel.id)
		: 0; // if null, set indx to 0

	console.log('indx for assessing current balance = '+indx);
	let currBal = 0;
	let promises = [];
	let aPromise;

	if(indx > 0) { // if jmodel is not the first element in the smodels
		bal = smodels[indx-1].balance; // previous account record's balance
		currBal = bal?bal:0; // if bal is null, then set it to 0
	}
	if(action == 'deleted') indx++; // as indx model is about to be deleted, do not include it for balance calc
	for(i=indx; i < smodels.length; i++){ // calculate new balance and apply
		let acct = smodels[i];
		currBal += (acct.crdr === 'cr') ? acct.amount : 0;
		currBal -= (acct.crdr === 'dr') ? acct.amount : 0;
		aPromise = new MaintenanceAccount({id: acct.id})
				.save({balance: currBal}, {patch: true}); // save the balance into database
		promises.push(aPromise);
	}

	return Promise.all(promises);
}

module.exports = { getAll, post, get, put, del };
