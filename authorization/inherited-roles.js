var	Role 		= require('./role-model');
var	Bookshelf 	= require('../config/database');

var Roles 		= Bookshelf.Collection.extend({
	model: Role
});


// api routes

// private functions
var retrieved_roles = null; // yet to retrieve all roles

(function retrieve_roles() {
	Roles.forge().fetch()
		.then(role_fetch_success)
		.catch(role_fetch_error);

	function role_fetch_success(allRoles){
		let roles = allRoles.toJSON();
		retrieved_roles = { error: false, data: roles};
	}
	function role_fetch_error(err){
		retrieved_roles = { error: true, data: {message: err.message} };
	}

})();


module.exports = function(role) {
	let ids = getInheritedIds(role);
	return ids;
}

function getInheritedIds(role) {

	let inheritedIds = getIds(role.inherits);
	if(inheritedIds.length < 1){
	 	return [];
	}
	if(retrieved_roles.error){
		return [];
	}
	let inhertiedRoles = retrieved_roles.data // get roles of inherited role ids
		.filter(each => inheritedIds.includes(each.id));
	inhertiedRoles
		.forEach(each => { // check for inherits of inherits
			let idsOfIds = getInheritedIds(each); // recursive call
			inheritedIds = inheritedIds.concat(idsOfIds);
		});
	return inheritedIds;
}

function getIds(inherits){
	logger.debug('getIds of inherits: ');
	logger.debug(inherits);
	if(inherits == null || inherits == ''){
		return [];
	}
	let separator = ',';
	let arr = inherits.split(separator); // example: inherits column value 'guest,manager,supervisor' becomes 'guest', 'manager', 'si[ervisor'
	let result = retrieved_roles.data
		.filter(each => arr.includes(each.name))
		.map(each => each.id);
	logger.debug('inherits ids: '); logger.debug(result);
	return result;
}
