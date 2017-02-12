//var _ 			= require('lodash'),
//	express 	= require('express'),
//	User 		= require('./models/user'),
var	Role 		= require('./models/role');
//	Permission 	= require('./models/permission'),	
var	Bookshelf 	= require('./config/database');
//	jwt			= require('jsonwebtoken'),
//	constants	= require('./config/constants');
//	bcrypt 		= require('bcrypt');

/*
var Users = Bookshelf.Collection.extend({
	model: User
});
*/

var Roles = Bookshelf.Collection.extend({
	model: Role
});

/*
var Permissions = Bookshelf.Collection.extend({
	model: Permission
});
*/

// api routes
// 
// private functions
var retrieved_roles = null; // yet to retrieve all roles 

(function retrieve_roles() {
	Roles.forge().fetch()
		.then(role_fetch_success)
		.catch(role_fetch_error);

	function role_fetch_success(allRoles){
		let roles = allRoles.toJSON();
//console.log('Roles with permissions...'); console.log(roles);		
		retrieved_roles = { error: false, data: roles};
	}
	function role_fetch_error(err){
		retrieved_roles = { error: true, data: {message: err.message} };
	}

})();


module.exports = function(role) {
	let ids = getInheritedIds(role);
//console.log('inh ids are: '); console.log(ids);
	return ids;
}

function getInheritedIds(role) {
//console.log('getInheritedIds for role...'); console.log(role);
	let inheritedIds = getIds(role.inherits);
//console.log('inheritedIds are: ...');console.log(inheritedIds);
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
	if(inherits == null || inherits == ''){
		return [];
	}
	let separator = ',';
	let arr = inherits.split(separator); // example: inherits column value '1,5,11' becomes '1', '5', '11'
	arr = arr.map(each => +each); // converts into number; example above becomes: 1, 5, 11
	return arr;
}
