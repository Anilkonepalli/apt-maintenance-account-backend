var	getUser		= require('./user-with-roles');
var	getInheritedIds = require('./inherited-roles');
var	getRoles    = require('./roles-with-permissions');
//var getPermissions = require('./user-permissions');
/**
 * Answer aBoolean indicating authorization for the request
 * @param  {number} userId
 * @return boolean
 */
module.exports = {
	allowsAdd: function(userId, resource) {
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
				//return Promise.resolve(permissions);
				let myPermsOnResource = permissions.filter(each => each.resource == resource);
//console.log('My permissions on "'+resource+'" is...'); console.log(myPermsOnResource);
				let myAddPerm = myPermsOnResource.find(each => each.operations.indexOf('C') > -1);
console.log('My Add Permission ...'); console.log(myAddPerm);
				//return myAddPerm != undefined;
				return myAddPerm !== undefined;

			})
			.cancel(err => {
				console.log('Error occurred in getting roles/perms...'); console.log(err);
			});


/*		getPermissions(userId).then(models => {
			perms = models.toJSON();
console.log('My permissions, for userId: '+userId+', are: '); console.log(perms);
			return true;			
		}); */

/*		let myPermissions = getPermissions(userId);
console.log('My permissions are: '); console.log(myPermissions);
		let myPermsOnResource = myPermissions.filter(each => each.resources.includes(resource));
console.log('My permissions on "'+resource+'" is...'); console.log(myPermsOnResource);
		let myAddPerm = myPermsOnResource.find(each => each.operations.indexOf('C') > -1);
console.log('My Add Permission ...'); console.log(myAddPerm);
		return myAddPerm != undefined;				*/
	}
}