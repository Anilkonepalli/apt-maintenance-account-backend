var getRoleIdsFor = require('./roleIdsFor');
var getPermissionsFor = require('./permissionsFor');

/**
 * Answers a Promise of Permissions, specific to the given user and resource
 * @param  number userId
 * @param  string resource 
 * @return Promise<Permission[]>
 */
module.exports = function(userId, resource){

	return new Promise( function(resolve, reject) {

		getRoleIdsFor(userId)
			.then(roleIds => {
				return getPermissionsFor(roleIds);
			})
			.then(perms => {
				let permsForResource = perms.filter(each => each.resource === resource);
				resolve(permsForResource);
			})
			.catch(err => reject(err));

	});

}