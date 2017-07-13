var Bookshelf = require('../config/database');

var Resident = Bookshelf.Model.extend({
	tableName: 'residents',
	hasTimestamps: true,
	softDelete: false, // soft delet is not required on this table
	flats: function() {
		return this.belongsToMany(Flat);
	},

	hello: function(){
		logger.log('debug', 'Hello, this is Resident Model');
	}
});

var Flat = Bookshelf.Model.extend({
	tableName: 'flats'
});

module.exports = Bookshelf.model('Resident', Resident);
