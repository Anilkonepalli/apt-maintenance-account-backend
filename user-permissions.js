var	getUser		= require('./user-with-roles'),
	getInheritedIds = require('./inherited-roles'),
	getRoles    = require('./roles-with-permissions');

/**
 * Answers Permissions for a given userId
 * @param  {number} userId
 * @return Promise<Permission[]> permission objects associated to 'userId'
 */
module.exports = function(userId) {

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
//console.log('Returning Promised Permissions from user-permissions.js...'); console.log(permissions);
			return Promise.resolve(permissions);
		})
		.cancel(err => {
			console.log('Error occurred in getting roles/perms...'); console.log(err);
		});


/*	getUser(userId)
		.then(model => {
			let user = model.toJSON();
			let roleIds = [];
			user.roles.forEach(eachRole => {
				roleIds.push(eachRole.id);
				let inhIds = getInheritedIds(eachRole);
				roleIds = roleIds.concat(inhIds);
			});
			if( roleIds.length < 1) return [];
			getRoles(roleIds)
				.then(models => {
					let roles = models.toJSON();
					let permissions = []; // holds all permission objects of the logged in user
					roles.forEach(eachModel => {
						perms = eachModel.permissions;
						permissions = permissions.concat(perms); 
					});
console.log('Returning Promised Permissions...'); console.log(permissions);
					return Promise.resolve(permissions);
				})
				.catch(err => {
					console.log('Error occurred in getting Roles...'); console.log(err);
				}); 

		})
		.cancel(err => {
			console.log('Error occurred in getting roles...'); console.log(err);
		}); */

}
