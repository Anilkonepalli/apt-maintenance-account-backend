var	Bookshelf 	= require('../config/database');
var	Flat 				= require('./flat-model');
var auth 				= require('../authorization/authorization');
var constants 	= require('../config/constants.json');

var Flats = Bookshelf.Collection.extend({
	model: Flat
});


// more routes for the API will happen here

// on routes that end in /flats
// ---------------------------------------------------------------------
function getAll(req, res) {
	Flats
		.forge()
		.fetch()
		.then(doAuth)
		.then(sendResponse)
		.catch(error);

	function doAuth(models) {
		logger.debug('/api/flats >> getAll()...');
		return auth.allowedList(req.decoded.id, 'flats', models);
	}
	function sendResponse(models) {
		logger.debug('models being sent are: '); logger.debug(models.toJSON());
		res.json(models);
	}
	function error(err) {
		logger.log('error', err.message);
		res.send({status: 500, data: null, message: err.message});
	}
}

// on routes that end in /flats/:id to get a flat
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new flat model
		auth.allowsAdd(req.decoded.id, 'flats') // is authorized to add ?
			.then(granted => res.json(new Flat()))
			.catch(error);
	} else { // respond with fetched flat model
		Flat
			.forge( {id: req.params.id} )
			.fetch()
			.then(doAuth) // is authorized to view?
			.then(model => res.json(model))
			.catch(error);
	}
	function doAuth(model) {
		logger.debug('/api/flats >> get()...');
		return auth.allowsView(req.decoded.id, 'flats', model);
	}
	function error(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /flats/myresidents/:id to get residents for flat id
// ---------------------------------------------------------------------
function getResidents(req, res) {
	logger.debug('Inside flat-routes >> getResidents() for flat id: '+req.params.id);
	Flat.forge( {id: req.params.id} ).fetch({withRelated: ['residents']})
		.then(model => {
			logger.debug('Flat model is retrieved...');
			let modelJson = model.toJSON();
			logger.debug(modelJson);
			res.json(modelJson.residents);
		})
		.catch(err => res.send(err));
}


// on routes that end in /flats/:id to update an existing flat
// ---------------------------------------------------------------------
function put(req, res) {

	let blockNumber = req.body.block_number;
	let flatNumber = req.body.flat_number;
	let model;

	Flat
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(sendResponse)
		.catch(error);

	function doAuth(model) {
		this.model = model;
		return auth.allowsEdit(req.decoded.id, 'flats', model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.debug('checkForDuplicate(...)!');
		logger.debug('granted...'+granted);
		return Flat
			.where({block_number: blockNumber,
						  flat_number: flatNumber })
		  .count('id'); // returns Promise containing count
	}
	function doUpdate(count){
		logger.debug('count is: '+count);
		if(count) {
		 throw new Error('Duplicate Error!');
	 	}
		logger.debug('/api/flats >> put()...updating flat details');
		return this.model.save({
			block_number: blockNumber || this.model.get('block_number'),
			flat_number: flatNumber || this.model.get('flat_number')
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Flat Details Updated'}});
	}
	function error(err) {
		logger.log('error', err.message);
		res.statusMessage = err.message;
		res.status(500).send();
	}
}

// on routes that end in /flats/myresidents/:id to update an existing Flat with myresidents
// --------------------------------------------------------------------------------------------
function putResidents(req, res) {
	let flatModel;
	logger.debug('Inside flat-routes >> putResidents(req,res)...');
	logger.debug('req params id: '+req.params.id);
	Flat.forge({id: req.params.id}).fetch({require: true, withRelated:['residents']})
		.then(detachExistingResidents)
		.then(attachNewResidents)
		.then(sendResponse)
		.catch(errorToNotify);

	function detachExistingResidents(model){ // remove existing residents first
		flatModel = model;
		logger.debug('Inside flat-routes >> detachExistingResidents(model)...');
		logger.debug(model.toJSON());
		return model.residents().detach();
	}
	function attachNewResidents(){
		logger.debug('inside flat-routes >> attachNewResidents(model)...');
		logger.debug(flatModel.toJSON());
		return flatModel.residents().attach(req.body.myresidentsIds); // attach new residents
	}

	function sendResponse(aColl) {
		res.json({error:false, data:{ message: 'My Residents are attached to Flat' }});
	}

	function errorToNotify(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}


// on routes that end in /flats to post (to add) a new flat
// ---------------------------------------------------------------------
function post(req, res) {

	let blockNumber = req.body.block_number;
	let flatNumber = req.body.flat_number;

	auth.allowsAdd(req.decoded.id, 'flats')
		.then(getTotalForMaxCheck)
		.then(getCountForDupCheck)
		.then(doSave)
		.then(sendResponse)
		.catch(error);

	function getTotalForMaxCheck(granted) {
		let tableName = Flat.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.debug('Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.debug('Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function getCountForDupCheck(total){ // implementing inner function1
		logger.debug('getCountForDupCheck(...)!!');
		if(total && total[0].CNT >= constants.maxRecords.flats) {
			let msg = 'Maximum Limit Reached! Cannot Save Flat details!';
			logger.log('error', msg);
			throw new Error(msg);
		}
		return Flat
			.where({block_number: blockNumber,
						  flat_number: flatNumber })
		  .count('id'); // returns Promise containing count
	}

	function doSave(count) {
		if(count) {
			throw new Error('Duplicate Error!!');
		}
		logger.debug('/api/flats >> post()...saving new flat details');
		return Flat.forge({
			block_number: blockNumber,
			flat_number: flatNumber
		}).save()
	}
	function sendResponse(model) {
		return res.json({error: false, data:{model}});
	}
	function error(err) {
		logger.log('error', err.message);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /flats/:id to delete a flat
// ---------------------------------------------------------------------
function del(req, res) {
	Flat
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(doDelete)
		.then(sendResponse)
		.catch(error);

	function doAuth(model) {
		return auth.allowsDelete(req.decoded.id, 'flats', model);
	}
	function doDelete(model){
		logger.debug('/api/flats >> del()...');
		return model.destroy();
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Flat Details Successfully Deleted'}});
	}
	function error(err) {
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

module.exports = { getAll, post, get, put, del, getResidents, putResidents };
