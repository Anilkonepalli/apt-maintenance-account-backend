var Bookshelf = require('../config/database');

var Flat = Bookshelf.Model.extend({
	tableName: 'flats',
	hasTimestamps: true,
	softDelete: true,
	residents: function() {
		return this.belongsToMany(Resident);
	},

	hello: function(){
		console.log('Hello, this is Flat Model');
	}
});

var Resident = Bookshelf.Model.extend({
	tableName: 'residents'
});

module.exports = Bookshelf.model('Flat', Flat);
