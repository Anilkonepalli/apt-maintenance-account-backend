var Bookshelf = require('../config/database');

var Resident = Bookshelf.Model.extend({
	tableName: 'residents',
	hasTimestamps: true,
	softDelete: true,
	flats: function() {
		return this.belongsToMany(Flat);
	},

	hello: function(){
		console.log('Hello, this is Resident Model');
	}
});

var Flat = Bookshelf.Model.extend({
	tableName: 'flats'
});

module.exports = Bookshelf.model('Resident', Resident);
