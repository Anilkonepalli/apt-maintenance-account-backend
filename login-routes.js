var _ 			= require('lodash'),
	express 	= require('express'),
	User 		= require('./models/user'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var Users = Bookshelf.Collection.extend({
	model: User
});

// application routing
var loginRoutes = module.exports = express.Router();

loginRoutes.route('/sessions/create').post(function(request, response){

	if( !request.body.email || !request.body.password){
		return response.status(400).send("Email and Password needed");
	}
	
	var user;

	if(retrieved_users.error){
		return response.status(400).send("Error in User List");	
	}
	user = _.find(retrieved_users.data, {email: request.body.email});

	if(!user){
		return response.status(401).send("Email or Password do not match");
	}
	if(! bcrypt.compareSync(request.body.password, user.password)) {
		return response.status(401).send("Email or Password don't match");
	}
	response.status(201).send({
		id_token: jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2})
	})	
});

// api routes

// private functions
var retrieved_users = null;  // yet to retrieve users

(function retrieve_users(){

	Users.forge().fetch({withRelated: ['roles']})
		.then(user_fetch_success)
		.catch(user_fetch_error);

	function user_fetch_success(allUsers){
		let usersWithRoles = allUsers.toJSON();
		usersWithRoles.forEach(eachUser => { // reduce the role object to mere its id, 
											 // so that it reduces JWT token size
			eachUser.roles = eachUser.roles.map(eachRole => eachRole.id);
		});
		retrieved_users = { error: false, data: usersWithRoles };
	}

	function user_fetch_error(err){
		retrieved_users = { error: true, data: {message: err.message} };
	}
})();
