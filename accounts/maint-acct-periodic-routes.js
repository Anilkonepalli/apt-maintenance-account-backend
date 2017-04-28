var	Bookshelf 			= require('../config/database');
var	MaintenanceAccount 	= require('./maint-acct-model');
var auth 				= require('../authorization/authorization');
var _ 					= require('lodash');

var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});


// more routes for the API will happen here


// on routes that end in /maintenance-accounts-periodic/
// ---------------------------------------------------------------------
function getAll(req, res) {
	MaintenanceAccounts
		.forge()
		.fetch()
		.then(doAuth)
		.then(sendResponse)
		.catch(sendError);

	function doAuth(models) {
		logger.log('info', '/api/maintenance-accounts-periodic >> getPeriodicList(...)');
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


module.exports = { getAll };
