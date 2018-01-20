var	Permission 	= require('./permission-model');
var	Bookshelf 	= require('../config/database');
var constants 	= require('../config/constants.json');
var auth 				= require('./authorization');
var Permissions = Bookshelf.Collection.extend({
	model: Permission
});

// on routes that end in /Permissions
// ---------------------------------------------------------------------
function getAll(req, res) {
	Permissions.forge().fetch()
		.then(models => res.json(models))
		.catch(err => res.send(err));
}

// on routes that end in /Permissions/:id to get an permission
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new permission model
		logger.log('debug', '/api/permissions >> get(new)...');
		res.json(new Permission());
	} else { // respond with fetched permission model
		logger.log('debug', '/api/permissions >> get(existing)...');
		Permission.forge( {id: req.params.id} ).fetch()
			.then(model => res.json(model))
			.catch(err => res.send(err));
	}
}

// on routes that end in /Permissions/:id to update an existing permission
// ---------------------------------------------------------------------
function put(req, res) {
	let model;
	logger.log('debug', 'Inside permission-routes >> put(req,res)...');
	logger.log('debug', 'req params id: '+req.params.id);

	Permission.forge({id: req.params.id}).fetch({require: true})
		.then(doAuth)
		.then(savePermission)
		.then(sendResponse)
		.catch(errorToNotify);

		function doAuth(model) {
			this.model = model;
			return auth.allowsEdit(req.decoded.id, 'permissions', model); // check whether logged user is allowed to Edit this role model
		}

		function savePermission(model) {
			logger.log('debug', 'Inside permission-routes >> savePermission(model)...');
			logger.log('debug', model.toJSON());

			return model.save({
				operations: req.body.operations || model.get('operations'),
				resource: req.body.resource || model.get('resource'),
				condition: req.body.condition, // optional field, it can be empty
				description: req.body.description || model.get('description')
			});
		}

		function sendResponse() {
			logger.log('debug', 'Inside permission-routes >> sendResponse()...');
			res.json({error: false, data:{message: 'Permission Details Updated'}});
		}

		function errorToNotify(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

}

// on routes that end in /Permissions to post (to add) a new permission
// ---------------------------------------------------------------------
function post(req, res) {

	auth.allowsAdd(req.decoded.id, 'permissions') // check whether logged user is allowed to add a Role
		.then(getTotalForMaxCheck)
		.then(doSave)
		.then(sendResponse)
		.catch(error);

	function getTotalForMaxCheck() {
		let tableName = Permission.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.log('debug', 'Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.log('debug', 'Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}
	function doSave(total){
		logger.log('debug', 'doSave(...)!!');
		if(total && total[0].CNT >= constants.maxRecords.permissions) {
			let msg = 'Maximum Limit Reached! Cannot Save Permission details!';
			logger.log('error', msg);
			throw new Error(msg);
		}
		return Permission.forge({
			operations: req.body.operations,
			resource: req.body.resource,
			condition: req.body.condition,
			description: req.body.description
		}).save()
	}
	function sendResponse(model){
		return res.json({error: false, data:{model}});
	}
	function error(err){
		return res.status(500).json({error: true, data:{message: err.message}});
	}
}

// on routes that end in /Permissions/:id to delete an permission
// ---------------------------------------------------------------------
function del(req, res) {

	let model;

	Permission.forge({id: req.params.id}).fetch({require: true})
		.then(doAuth)
		.then(doDelete)
		.catch(notifyError);

	function doAuth(model) {
		this.model = model;
		return auth.allowsDelete(req.decoded.id, 'permissions', model); // check whether logged user is allowed to Delete role model
	}

	function doDelete(model){
		model.destroy()
			.then( () => res.json({error: true, data: {message: 'Permission model successfully deleted'} }))
			.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
	}
	function notifyError(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}

module.exports = { getAll, post, get, put, del };
