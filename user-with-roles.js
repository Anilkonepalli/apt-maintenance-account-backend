var _ 			= require('lodash'),
//	express 	= require('express'),
	User 		= require('./models/user'),
	Role 		= require('./models/role'),
	Permission 	= require('./models/permission'),	
	Bookshelf 	= require('./config/database'),
//	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants');
//	bcrypt 		= require('bcrypt');


var Users = Bookshelf.Collection.extend({
	model: User
});
var Roles = Bookshelf.Collection.extend({
	model: Role
});
var Permissions = Bookshelf.Collection.extend({
	model: Permission
});

// api routes

module.exports = function(userId) {
	return User
			.forge({id: userId})
			.fetch({withRelated: ['roles']});
}