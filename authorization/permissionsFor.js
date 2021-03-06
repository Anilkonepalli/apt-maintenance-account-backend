var	Role 		= require('./role-model');
var	Bookshelf 	= require('../config/database');

var Roles 		= Bookshelf.Collection.extend({
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
				logger.debug('Role models are: ');
				logger.debug(roles);
				let permissions = [];
				roles.forEach(eachModel => {
					logger.debug('each role model is: ');
					logger.debug(eachModel);
					perms = eachModel.permissions;
					permissions = permissions.concat(perms);
				});
				logger.debug('Related permissions are: ');
				logger.debug(permissions);
				resolve(permissions);
			})
			.catch(err => reject(err));
	});
}
