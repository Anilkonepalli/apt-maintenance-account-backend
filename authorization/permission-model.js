var Bookshelf = require('../config/database');

var Permission = Bookshelf.Model.extend({
	tableName: 'permissions',
	hasTimestamps: true,
	softDelete: true,
	roles: function() {
		return this.belongsToMany(Role);
	},

	hello: function(){
		console.log('Hello, this is Permission Model');
	}
});

module.exports = Bookshelf.model('Permission', Permission);