// models/user.js

var Bookshelf = require('../config/database');

//var RoleUser = Bookshelf.Model.extend({tableName: 'roles_users'});

var User = Bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	softDelete: true,
	roles: function() {
		//return this.belongsToMany(Role).through(RoleUser);
		return this.belongsToMany(Role);
	},

	hello: function(){
		console.log('Hello, this is User Model');
	}
});

var Role = Bookshelf.Model.extend({
	tableName: 'roles'
})

module.exports = Bookshelf.model('User', User);