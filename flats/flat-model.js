var Bookshelf = require('../config/database');

var Flat = Bookshelf.Model.extend({
	tableName: 'flats',
	hasTimestamps: true,
	softDelete: false, // soft delete is not required for this table
	residents: function() {
		return this.belongsToMany(Resident);
	},

	hello: function(){
		logger.log('info', 'Hello, this is Flat Model');
	}
});

var Resident = Bookshelf.Model.extend({
	tableName: 'residents'
});

module.exports = Bookshelf.model('Flat', Flat);
