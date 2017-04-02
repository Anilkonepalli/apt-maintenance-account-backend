var Bookshelf = require('../config/database');

var Flat = Bookshelf.Model.extend({
	tableName: 'flats',
	hasTimestamps: true,
	softDelete: true,

	hello: function(){
		console.log('Hello, this is Flat Model');
	}
});

module.exports = Bookshelf.model('Flat', Flat);
