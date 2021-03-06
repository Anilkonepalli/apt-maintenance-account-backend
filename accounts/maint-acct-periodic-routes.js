var	Bookshelf 					= require('../config/database');
var	MaintenanceAccount 	= require('./maint-acct-model');
var auth 								= require('../authorization/authorization');
var _ 									= require('lodash');

var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});

var	Flat 								= require('../flats/flat-model');
var Flats 							= Bookshelf.Collection.extend({
														model: Flat
													});

// on routes that end in /maintenance-accounts-periodic/
// ---------------------------------------------------------------------
function getAll(req, res) {

	let availableModels = [];
	let jmodels = [];
	let flats = [];
	let jflats = [];

	MaintenanceAccounts
		.query('where', 'for_month', '=', +req.query.month)
		.query('where', 'for_year', '=', +req.query.year)
		.fetch()
		.then(doAuth)
		.then(getFlats)
		.then(fillMissingModels)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(models) {
		availableModels = models;
		jmodels = models.toJSON();
		logger.log('info',
							 '/api/maintenance-accounts-periodic >> getPeriodicList('
							 +req.query.month
							 +', '
							 +req.query.year
							 +')'
		);
		return auth.allowedList(req.decoded.id, 'accounts', models);
	}
	function getFlats(models) {
		return Flats.forge().fetch();
	}

	function fillMissingModels(flatz) {
		flats = flatz;
		jflats = flatz.toJSON();

		let flatNumbers = jmodels.map(e => e.flat_number);
		let acct;
		let today = new Date().toISOString().split('T')[0]; // only consider date string and ignore time portion

		jflats.forEach(e => {
			if ( !flatNumbers.includes(e.flat_number) ) { // check for missing flat number
				acct = new MaintenanceAccount().toJSON();
				acct.id = 0;
				acct.flat_number = e.flat_number;
				acct.for_month = req.query.month;
				acct.for_year = req.query.year;
				acct.recorded_at = today;
				acct.crdr = 'cr';
				acct.item = 'Monthly Maintenance Fee';
				acct.name = e.flat_number+' Resident';
				acct.amount = 600;
				acct.balance = '';
				acct.category = 'Monthly Maintenance';
				acct.remarks = 'Paid monthly maintenance';
				jmodels.push(acct);
			}
		});
		return new Promise((resolve) => resolve(jmodels));
	}
	// sends Account models after sorting; sorting is based on its recorded_at field and then id field
	function sendResponse(jmodels) {
		let sortedModels = _.sortBy(jmodels, [
				function(model){ return model.flat_number; }
			]);
		res.json(sortedModels);
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /maintenance-accounts-for/
// ---------------------------------------------------------------------
function getMonthlyAccountsFor(req, res) {

	//let availableModels = [];
	//let jmodels = [];
	//let flats = [];
	//let jflats = [];

	MaintenanceAccounts
		.query('where', 'flat_number', '=', req.query.flatNumber)
		.query('where', 'for_month', '=', +req.query.month)
		.query('where', 'for_year', '=', +req.query.year)
		.fetch()
		.then(doAuth)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(models) {
		//availableModels = models;
		//jmodels = models.toJSON();
		logger.log('info',
							 '/api/maintenance-accounts-for >> getMonthlyAccountFor('
							 +req.query.flatNumber
							 +', '
							 +req.query.month
							 +', '
							 +req.query.year
							 +')'
		);
		return auth.allowedList(req.decoded.id, 'accounts', models);
	}
	// sends Account model for the gien flat number, transaction month and year
	function sendResponse(authorizedModels) {
		logger.log('info', 'authorizedModels................')
		logger.log('info', authorizedModels)
		res.json(authorizedModels);
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}


module.exports = { getAll, getMonthlyAccountsFor };
