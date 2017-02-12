//var _ 			= require('lodash'),
//	express 	= require('express'),
//	User 		= require('./models/user'),
//	Role 		= require('./models/role'),
//	Permission 	= require('./models/permission'),	
//	Bookshelf 	= require('./config/database'),
//	jwt			= require('jsonwebtoken'),
var	getUser		= require('./user-with-roles'),
	getInheritedIds = require('./inherited-roles'),
	getRoles    = require('./roles-with-permissions');
//	constants	= require('./config/constants');
//	bcrypt 		= require('bcrypt');

/*
var Users = Bookshelf.Collection.extend({
	model: User
});
var Roles = Bookshelf.Collection.extend({
	model: Role
});
var Permissions = Bookshelf.Collection.extend({
	model: Permission
});
*/

// api routes
/**
 * Answers Permissions for a given userId
 * @param  {number} userId [description]
 * @return {[Permissions]} permission objects [associated to the userId]
 */
module.exports = function(userId) {
	getUser(userId) // for the given userId, get User object from table
		.then(model => {
			user = model.toJSON();
console.log('Retrieved User...'); console.log(user);
			let roleIds = []; // holds all roleIds inclusive of inherited ones of the logged in user
			user.roles.forEach(eachRole => { // iterate each role and also collect its inherited role ids
				roleIds.push(eachRole.id);
				let inhIds = getInheritedIds(eachRole); // gets inherited role ids
				roleIds = roleIds.concat(inhIds);
			});
console.log('all my role ids are: '); console.log(roleIds);
			getRoles(roleIds) // get Role objects from table
				.then(models => {
					let roles = models.toJSON();
console.log('My roles are: '); console.log(roles);		
					let permissions = []; // holds all permission objects of the logged in user
					roles.forEach(eachModel => {
//						perms = eachModel.permissions
//								.filter(perms => perms.resource === req.params.name);
						perms = eachModel.permissions;
						permissions = permissions.concat(perms); 
					});
console.log('My permissions are: '); console.log(permissions);						
					//res.json(permissions);
					return permissions;
				})
				.catch(err => {
					//res.send(err)
					console.log('Error occurred in getting Roles...'); console.log(err);
				});
		})
		.catch(err => {
			//res.send(err)
			console.log('Error occurred in getting Users...'); console.log(err);
		});

}