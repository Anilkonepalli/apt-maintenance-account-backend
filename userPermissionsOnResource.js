var getRoleIdsFor = require('./userRoleIds');
var getPermissionsFor = require('./roleIdsPermissions');

//var	Role 		= require('./models/role');
//var	Bookshelf 	= require('./config/database');

//var Roles = Bookshelf.Collection.extend({
//	model: Role
//});

module.exports = function(userId, resource){

	return new Promise( function(resolve, reject) {

		getRoleIdsFor(userId)
			.then(roleIds => {
				console.log('Role Ids'); console.log(roleIds);
				return getPermissionsFor(roleIds);
			})
			.then(perms => {
				console.log('Permissions...'); console.log(perms);
				let permsForResource = perms.filter(each => each.resource === resource);
				resolve(permsForResource);
			})
			.catch(err => reject(err));

	});

}