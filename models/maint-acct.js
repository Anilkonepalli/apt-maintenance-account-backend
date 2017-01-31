// models/maint-acct.js

var Bookshelf = require('../config/database');

var MaintenanceAccount = Bookshelf.Model.extend({
	tableName: 'maintenance_accounts',
	hasTimestamps: true,
	softDelete: true,

	hello: function(){
		console.log('Hello, this is MaintenanceAccount Model');
	}
});

module.exports = Bookshelf.model('MaintenanceAccount', MaintenanceAccount);