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
//var userRoutes = module.exports = express.Router();
var loginRoutes = express.Router();

loginRoutes.route('/sessions/create').post(function(request, response){
	console.log('Login user...');
	console.log('Email Received as: '+request.body.email);
	console.log('Password Received as: '+request.body.password);

	if( !request.body.email || !request.body.password){
		console.log('Email and Password needed....');
		return response.status(400).send("Email and Password needed");
	}
	
	var user;
	console.log('Retrived Users data: ');
	console.log(retrieved_users.data);

	if(retrieved_users.error){
		return response.status(400).send("Error in User List");	
	}
	user = _.find(retrieved_users.data, {email: request.body.email});

	console.log('User object:');
	console.log(user);

	if(!user){
		console.log("Email or Password do not match");
		return response.status(401).send("Email or Password do not match");
	}
	if(! bcrypt.compareSync(request.body.password, user.password)) {
		console.log("Email or Password don't match");
		return response.status(401).send("Email or Password don't match");
	}
	console.log('Login success...');
	response.status(201).send({
		//id_token: create_token(user)
		id_token: jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2})
	})	
});



// api routes


// private functions
var retrieved_users = null;  // yet to retrieve users

(function retrieve_users(){
	console.log('Retrieve User List');
	Users.forge().fetch()
		.then(user_fetch_success)
		.catch(user_fetch_error);
//	var result = {error:true, data:{message: 'Incomplete Retrieve'}};

	function user_fetch_success(collection){
		console.log('User Fetch Success...');
		retrieved_users = { error: false, data: collection.toJSON() };
	}
	function user_fetch_error(err){
		console.log('User error...');
		console.log(err);
		retrieved_users = { error: true, data: {message: err.message} };
	}
//	return result;
})();

/*
function create_token(user){
	return jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2});
}

function login_user(request, response){
	console.log('Login user...');
	console.log('Email Received as: '+request.body.email);
	console.log('Password Received as: '+request.body.password);

	if( !request.body.email || !request.body.password){
		console.log('Email and Password needed....');
		return response.status(400).send("Email and Password needed");
	}
	
	var user;
	console.log('Retrived Users data: ');
	console.log(retrieved_users.data);

	if(retrieved_users.error){
		return response.status(400).send("Error in User List");	
	}
	user = _.find(retrieved_users.data, {email: request.body.email});

	console.log('User object:');
	console.log(user);

	if(!user){
		console.log("Email or Password do not match");
		return response.status(401).send("Email or Password do not match");
	}
	if(! bcrypt.compareSync(request.body.password, user.password)) {
		console.log("Email or Password don't match");
		return response.status(401).send("Email or Password don't match");
	}
	console.log('Login success...');
	response.status(201).send({
		//id_token: create_token(user)
		id_token: jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2})
	})
}
*/


module.exports = loginRoutes;