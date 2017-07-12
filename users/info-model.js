var Bookshelf 	= require('../config/database');
require('./user-model');

var Info 		= Bookshelf.Model.extend({
	tableName: 'infos',
	hasTimestamps: true,
	softDelete: true,
	user: function() {
		return this.belongsTo(User);
	}
});

module.exports = Bookshelf.model('Info', Info);
