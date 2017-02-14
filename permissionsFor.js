var	Role 		= require('./models/role');
var	Bookshelf 	= require('./config/database');

var Roles = Bookshelf.Collection.extend({
	model: Role
});

/**
 * Answers Permissions for the given roleIds
 * @param  number[] roleIds
 * @return Promise<Permission[]>
 */
module.exports = function(roleIds){
	return new Promise( function(resolve, reject){
		Roles
			.query(qb => qb.where('id', 'in', roleIds))
			.fetch({withRelated: ['permissions']})
			.then(models => {
				let roles = models.toJSON();
				let permissions = [];
				roles.forEach(eachModel => {
					perms = eachModel.permissions;
					permissions = permissions.concat(perms); 
				});
				resolve(permissions);
			})
			.catch(err => reject(err));
	});
}