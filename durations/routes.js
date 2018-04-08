var	Bookshelf = require('../config/database');
var	Duration  = require('./model');
var auth 			= require('../authorization/authorization');
var constants	= require('../config/constants.json');

var Durations = Bookshelf.Collection.extend({
	model: Duration
});


// more routes for the API will happen here

// on routes that end in /durations
// ---------------------------------------------------------------------
function getAll(req, res) {
	Durations
		.forge()
		.fetch()
		.then(doAuth)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(models) {
		logger.debug('/api/durations >> getAll()...');
		return auth.allowedList(req.decoded.id, 'durations', models);
	}
	function sendResponse(models) {
		logger.debug('models being sent are: '); logger.debug(models.toJSON());
		res.json(models);
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /durations/:id to get a duration
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new duration model
		auth.allowsAdd(req.decoded.id, 'durations') // is authorized to add ?
			.then(granted => res.json(new Duration()))
			.catch(errorToNotify);
	} else { // respond with fetched re model
		Duration
			.forge( {id: req.params.id} )
			.fetch()
			.then(doAuth) // is authorized to view?
			.then(model => res.json(model))
			.catch(errorToNotify);
	}
	function doAuth(model) {
		logger.debug('/api/durations >> get()...');
		return auth.allowsView(req.decoded.id, 'durations', model);
	}
	function errorToNotify(err) {
		logger.error(err)
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /durations/active/:key to get a duration
// ---------------------------------------------------------------------
function getActive(req, res) {
	if(req.params.id === '0') { // respond with a new duration model
		auth.allowsAdd(req.decoded.id, 'durations') // is authorized to add ?
			.then(granted => res.json(new Duration()))
			.catch(errorToNotify);
	} else { // respond with fetched re model
		let today = new Date().toISOString().split('T')[0];
		Duration
			.query('where', 'key', '==', req.params.key)
			.query('where', 'effective_from', '<=', today)
			.query('where', 'effective_to', '>=', today)
			.fetch()
			.then(doAuth) // is authorized to view?
			.then(model => res.json(model))
			.catch(errorToNotify);
	}
	function doAuth(model) {
		logger.debug('/api/durations >> get()...');
		return auth.allowsView(req.decoded.id, 'durations', model);
	}
	function errorToNotify(err) {
		logger.error(err)
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /durations/:id to update an existing duration
// ---------------------------------------------------------------------
function put(req, res) {

	let key = req.body.key;
	let value = req.body.value;
	let effectiveFrom = req.body.effective_from;
	let effectiveTo = req.body.effective_to;
	let remarks = req.body.remarks;
	let model;

	Duration
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(model) {
		this.model = model;
		return auth.allowsEdit(req.decoded.id, 'durations', model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.debug('checkForDuplicate(...)!');
		logger.debug('granted...'+granted);
		let jModel = this.model.toJSON();
		if(jModel.key === key
			&& jModel.effective_from === effectiveFrom
			&& jModel.effective_to === effectiveTo){
				return Promise.resolve(0); // if no change in names, return count as zero
		}
		return Duration
			.where({key: key,
						  effective_from: effectiveFrom,
						 	effective_to: effectiveTo})
		  .count('id'); // returns Promise containing count
	}
	function doUpdate(count){
		logger.debug('count is: '+count);
		if(count) {
		 throw new Error('Duplicate Error!');
	 	}
		logger.debug('/api/durations >> put()...updating duration details');
		return this.model.save({
			key: key || this.model.get('key'),
			value: value || this.model.get('value'),
			effective_from: effectiveFrom || this.model.get('effective_from'),
			effective_to: effectiveTo || this.model.get('effective_to'),
			remarks: remarks || this.model.get('remarks'),
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Duration Details Updated'}});
	}
	function errorToNotify(err) {
		logger.error(err);
		//res.statusMessage = err.message;
		//res.status(500).send();
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /durations to post (to add) a new duration
// ---------------------------------------------------------------------
function post(req, res) {

	let key = req.body.key;
	let value = req.body.value;
	let effectiveFrom = req.body.effective_from;
	let effectiveTo = req.body.effective_to;
	let remarks = req.body.remarks;

	auth.allowsAdd(req.decoded.id, 'durations')
		.then(getTotalForMaxCheck)
		.then(getCountForDupCheck)
		.then(doSave)
		.then(sendResponse)
		.catch(errorToNotify);

	function getTotalForMaxCheck(granted) {
		let tableName = Duration.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.debug('Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.debug('Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function getCountForDupCheck(total){ // implementing inner function1
		logger.debug('getCountForDupCheck(...)!!');
		if(total && total[0].CNT >= constants.maxRecords.durations) {
			let msg = 'Maximum Limit Reached! Cannot Save Duration details!';
			logger.error(msg);
			throw new Error(msg);
		}
		return Duration
			.where({key: key,
						  effective_from: effectiveFrom,
						 	effective_to: effectiveTo})
		  .count('id'); // returns Promise containing count
	}

	function doSave(count) {
		if(count) {
			throw new Error('Duplicate Error!!');
		}
		logger.debug('/api/durations >> post()...saving new duration details');

		return Duration.forge({
					key: key,
					value: value,
					effective_from: effectiveFrom,
					effective_to: effectiveTo,
					remarks: remarks
			}).save();
	}
	function sendResponse(model) {
		return res.json({error: false, data:{model}});
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /durations/:id to delete a duration
// ---------------------------------------------------------------------
function del(req, res) {
	Duration
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(doDelete)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(model) {
		return auth.allowsDelete(req.decoded.id, 'durations', model);
	}
	function doDelete(model){
		logger.debug('/api/durations >> del()...');
		return model.destroy();
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Duration Details Successfully Deleted'}});
	}
	function errorToNotify(err) {
		logger.error(err)
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

module.exports = { getAll, getActive, post, get, put, del };
