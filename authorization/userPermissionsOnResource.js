var getRoleIdsFor 		= require('./roleIdsFor');
var getPermissionsFor 	= require('./permissionsFor');

/**
 * Answers a Promise of Permissions, specific to the given user and resource.
 * If resource is not provided, all permissions associated to the user are returned
 * @param  number userId
 * @param  string resource
 * @return Promise<Permission[]>
 */
module.exports = function(userId, resource = null){

	return new Promise( function(resolve, reject) {

		getRoleIdsFor(userId)
			.then(roleIds => {
				return getPermissionsFor(roleIds);
			})
			.then(perms => {
				if(resource){
					let permsForResource = perms.filter(each => each.resource === resource);
					resolve(permsForResource);
				} else {
					resolve(perms);
				}
			})
			.catch(err => reject(err));

	});

}

/*
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
 */
