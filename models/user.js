// models/user.js

var Bookshelf = require('../config/database');

var User = Bookshelf.Model.extend({
	tableName: 'users',
	hasTimestamps: true,
	softDelete: true,
	roles: function() {
		return this.belongsToMany(Role);
	},

	hello: function(){
		console.log('Hello, this is User Model');
	}
});

module.exports = Bookshelf.model('User', User);