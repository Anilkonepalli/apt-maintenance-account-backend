// models/user.js

var Bookshelf = require('../config/database');

var Role = Bookshelf.Model.extend({
	tableName: 'roles',
	hasTimestamps: true,
	softDelete: true,
	users: function() {
		return this.belongsToMany(User);
	},
	permissions: function() {
		return this.belongsToMany(Permission);
	}

	hello: function(){
		console.log('Hello, this is Role Model');
	}
});

module.exports = Bookshelf.model('Role', Role);