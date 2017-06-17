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
				logger.log('info', 'getRoleIdsFor('+roleIds+')');
				return getPermissionsFor(roleIds);
			})
			.then(perms => {
				if(resource){
					logger.log('info', 'filter permissions for resource: '+resource);
					let permsForResource = perms.filter(each => each.resource === resource);
					logger.log('info', permsForResource);
					resolve(permsForResource);
				} else {
					logger.log('debug', 'resource is null; so send all permissions...');
					logger.log('debug', perms);
					resolve(perms);
				}
			})
			.catch(err => reject(err));

	});

}
