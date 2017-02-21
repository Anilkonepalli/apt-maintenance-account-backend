var	Permission 	= require('./permission-model');
var	Bookshelf 	= require('../config/database');

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
		res.json(new Permission());
	} else { // respond with fetched permission model
		Permission.forge( {id: req.params.id} ).fetch()
			.then(model => res.json(model))
			.catch(err => res.send(err));
	}
}


// on routes that end in /Permissions/:id to update an existing permission
// ---------------------------------------------------------------------
function put(req, res) {
	Permission.forge({id: req.params.id}).fetch({require: true})
		.then(doUpdate)
		.catch(notifyError);

	function doUpdate(model){
		model.save({
			resource: req.body.resource || model.get('resource')
		})
		.then(function(){
			res.json({error: false, data:{message: 'Permission Details Updated'}});
		})
		.catch(function(err){
			res.status(500).json({error: true, data: {message: err.message}});
		});
	}
	function notifyError(err){
		res.status(500).json({error: true, data: {message: err.message}});
	}
}

// on routes that end in /Permissions to post (to add) a new permission
// ---------------------------------------------------------------------
function post(req, res) {
	Permission.forge({
		resource: req.body.resource,
	})
	.save()
	.then( model => res.json({error: false, data:{model}}))
	.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
}

// on routes that end in /Permissions/:id to delete an permission
// ---------------------------------------------------------------------
function del(req, res) {
	Permission.forge({id: req.params.id}).fetch({require: true})
		.then(doDelete)
		.catch(notifyError);

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