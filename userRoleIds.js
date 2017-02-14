var	User 		= require('./models/user');
var	Bookshelf 	= require('./config/database');
var	constants	= require('./config/constants');
var	getInheritedIds = require('./inherited-roles');

var Users = Bookshelf.Collection.extend({
	model: User
});

module.exports = function(userId) {
	return new Promise(function(resolve, reject){
		User
			.forge({id: userId})
			.fetch({withRelated: ['roles']})
			.then(model => {
				let user = model.toJSON();
				let roleIds = [];
				user.roles.forEach(eachRole => {
					roleIds.push(eachRole.id);
					let inhIds = getInheritedIds(eachRole);
					roleIds = roleIds.concat(inhIds);
				});
				resolve(roleIds);
			})
			.catch(err => reject(err));	
	});
}