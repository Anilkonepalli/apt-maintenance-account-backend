var Bookshelf 		= require('../config/database');
//require('../users/user-model');
// var PermissionRole 	= Bookshelf.Model.extend({tableName: 'permissions_roles'});

var Role = Bookshelf.Model.extend({
	tableName: 'roles',
	hasTimestamps: true,
	softDelete: false, // soft delete is not required on Roles table
	users: function() {
		return this.belongsToMany(User);
	},
	permissions: function() {
		return this.belongsToMany(Permission);
	},

	hello: function(){
		logger.log('info', 'Hello, this is Role Model');
	}
});

var Permission = Bookshelf.Model.extend({
	tableName: 'permissions'
});


module.exports = Bookshelf.model('Role', Role);
