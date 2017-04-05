var Bookshelf = require('../config/database');

var Resident = Bookshelf.Model.extend({
	tableName: 'residents',
	hasTimestamps: true,
	softDelete: true,

	hello: function(){
		console.log('Hello, this is Resident Model');
	}
});

module.exports = Bookshelf.model('Resident', Resident);
