var Bookshelf = require('../config/database');

var Permission = Bookshelf.Model.extend({
	tableName: 'permissions',
	hasTimestamps: true,
	softDelete: false,  // soft delete is not required on permissions table
	roles: function() {
		return this.belongsToMany(Role);
	},

	hello: function(){
		logger.log('debug', 'Hello, this is Permission Model');
	}
});

module.exports = Bookshelf.model('Permission', Permission);
