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
		.fetch({withRelated: ['residents']})
		.then(doAuth)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(models) {
		logger.debug('/api/flats >> getAll()...');
		return auth.allowedList(req.decoded.id, 'flats', models);
	}
	function sendResponse(models) {
		logger.debug('models being sent are: '); logger.debug(models.toJSON());
		res.json(models);
	}
/*
	function errorToNotify(err) {
		logger.error(err);
		res.send({status: 500, data: null, message: err.message});
	}
*/
	function errorToNotify(err) {
		logger.error(err)
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /flats/:id to get a flat
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new flat model
		auth.allowsAdd(req.decoded.id, 'flats') // is authorized to add ?
			.then(granted => res.json(new Flat()))
			.catch(errorToNotify);
	} else { // respond with fetched flat model
		Flat
			.forge( {id: req.params.id} )
			.fetch()
			.then(doAuth) // is authorized to view?
			.then(model => res.json(model))
			.catch(errorToNotify);
	}
	function doAuth(model) {
		logger.debug('/api/flats >> get()...');
		return auth.allowsView(req.decoded.id, 'flats', model);
	}
	function errorToNotify(err) {
		logger.error(err)
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
	let maxOwners = req.body.max_owners;
	let maxTenants = req.body.max_tenants;
	let model;

	Flat
		.forge({id: req.params.id})
		.fetch({require: true})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(model) {
		this.model = model;
		return auth.allowsEdit(req.decoded.id, 'flats', model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.debug('checkForDuplicate(...)!');
		logger.debug('granted...'+granted);
		return Flat
			.where({block_number: blockNumber,
						  flat_number: flatNumber,
						 	max_owners: maxOwners,
							max_tenants: maxTenants})
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
			flat_number: flatNumber || this.model.get('flat_number'),
			max_owners: maxOwners || this.model.get('max_owners'),
			max_tenants: maxTenants || this.model.get('max_tenants')
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Flat Details Updated'}});
	}
	function errorToNotify(err) {
		logger.error(err);
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
//	Flat.forge({id: req.params.id}).fetch({require: true, withRelated:['residents']})
	retrieveModelWithResidents()
		.then(doAuth)
		.then(detachExistingResidents)
		.then(attachNewResidents)
		.then(retrieveModelWithResidents)
		.then(sendResponse)
		.catch(errorToNotify);

	function retrieveModelWithResidents() {
		logger.debug('retrieving flat with residents');
		return Flat.forge({id: req.params.id}).fetch({require: true, withRelated:['residents']})
	}
	function doAuth(model) {
		this.flatModel = model;
		return auth.allowsEdit(req.decoded.id, 'flats-residents', model); // check whether logged user is allowed to Edit
	}
	function detachExistingResidents(granted){ // remove existing residents first
		let model = this.flatModel;
		logger.debug('Inside flat-routes >> detachExistingResidents(model)...');
		logger.debug(model.toJSON());
		return model.residents().detach();
	}
	function attachNewResidents(){
		logger.debug('inside flat-routes >> attachNewResidents(model)...');
		logger.debug(this.flatModel.toJSON());
		return this.flatModel.residents().attach(req.body.myresidentsIds); // attach new residents
	}
/*
	function sendResponse(aColl) {
		res.json({error:false, data:{ message: 'My Residents are attached to Flat' }});
	}
*/
	function sendResponse(model) {
		let modelJson = model.toJSON();
		logger.debug('inside flat-routes >> sendResponse(model)')
		logger.debug(modelJson)
		res.json(modelJson.residents);
	}

	function errorToNotify(err){
		logger.error(err);
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
		.catch(errorToNotify);

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
	function errorToNotify(err) {
		logger.error(err);
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
		.catch(errorToNotify);

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
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}
}

module.exports = { getAll, post, get, put, del, getResidents, putResidents };
