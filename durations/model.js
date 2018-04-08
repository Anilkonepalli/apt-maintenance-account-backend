var Bookshelf = require('../config/database');

var Duration = Bookshelf.Model.extend({
	tableName: 'durations',
	hasTimestamps: true,
	softDelete: false, // soft delet is not required on this table

	hello: function(){
		logger.log('debug', 'Hello, this is a Duration Model');
	}
});

module.exports = Bookshelf.model('Duration', Duration);
