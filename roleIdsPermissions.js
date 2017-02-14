var	Role 		= require('./models/role');
var	Bookshelf 	= require('./config/database');

var Roles = Bookshelf.Collection.extend({
	model: Role
});

module.exports = function(roleIds){
	return new Promise( function(resolve, reject){
		Roles
			.query(qb => qb.where('id', 'in', roleIds))
			.fetch({withRelated: ['permissions']})
			.then(models => {
				let roles = models.toJSON();
				let permissions = []; // holds all permission objects of the logged in user
				roles.forEach(eachModel => {
					perms = eachModel.permissions;
					permissions = permissions.concat(perms); 
				});
				resolve(permissions);
			})
			.catch(err => reject(err));
	});
}