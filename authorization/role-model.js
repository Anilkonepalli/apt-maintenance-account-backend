var Bookshelf 		= require('../config/database');

var PermissionRole 	= Bookshelf.Model.extend({tableName: 'permissions_roles'});

var Role = Bookshelf.Model.extend({
	tableName: 'roles',
	hasTimestamps: true,
	softDelete: true,
	users: function() {
		return this.belongsToMany(User);
	},
	permissions: function() {
		//return this.belongsToMany(Permission).through(PermissionRole);
		return this.belongsToMany(Permission);
	},

	hello: function(){
		console.log('Hello, this is Role Model');
	}
});

var Permission = Bookshelf.Model.extend({
	tableName: 'permissions'
});


module.exports = Bookshelf.model('Role', Role);