var getUserPermissions = require('./userPermissionsOnResource');
//var	getUser		= require('./user-with-roles');
//var getUserRoleIds = require('./userRoleIds');
//var getRoleIdsPermissions = require('./roleIdsPermissions');
//var	getInheritedIds = require('./inherited-roles');
//var	getRoles    = require('./roles-with-permissions');
//var getPermissions = require('./user-permissions');
/**
 * Answer aBoolean indicating authorization for the request
 * @param  {number} userId
 * @return boolean
 */
module.exports = {
	allowsAdd: function(userId, resource) {

		return new Promise( function(resolve, reject) {

			getUserPermissions(userId, resource)
				.then(perms => {
					console.log('Permissions on resource...'); console.log(perms);
					let myAddPerm = perms.find(each => each.operations.indexOf('C') > -1);
					resolve(myAddPerm !== undefined);
				})
				.catch(err => reject(err));
/*			getUserRoleIds(userId)
				.then(roleIds => {
					console.log('Role Ids'); console.log(roleIds);
					return getRoleIdsPermissions(roleIds);
				})
				.then(perms => {
					console.log('Permissions...'); console.log(perms);
				})
				.catch(err => console.log(err)); */

			//resolve(true); // just for testing purpose

		});


/*
	return new Promise( function(resolve, reject) {
		getUser(userId)
			.then(model => {
				let user = model.toJSON();
				let roleIds = [];
				user.roles.forEach(eachRole => {
					roleIds.push(eachRole.id);
					let inhIds = getInheritedIds(eachRole);
					roleIds = roleIds.concat(inhIds);
				});
				if( roleIds.length < 1) return [];
				return getRoles(roleIds);
			})
			.then(models => {
				let roles = models.toJSON();
				let permissions = []; // holds all permission objects of the logged in user
				roles.forEach(eachModel => {
					perms = eachModel.permissions;
					permissions = permissions.concat(perms); 
				});
//console.log('Identified Permissions...'); console.log(permissions);
				let myPermsOnResource = permissions.filter(each => each.resource == resource);
//console.log('My permissions on "'+resource+'" is...'); console.log(myPermsOnResource);
				let myAddPerm = myPermsOnResource.find(each => each.operations.indexOf('C') > -1);
console.log('My Add Permission ...'); console.log(myAddPerm);
				//return myAddPerm != undefined;
				resolve(myAddPerm !== undefined);
			})
			.cancel(err => {
				console.log('Error occurred in getting roles/perms...'); console.log(err);
				reject(err);
			});
	});  */

	}
}