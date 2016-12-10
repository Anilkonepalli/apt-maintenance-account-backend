var _ 			= require('lodash'),
	express 	= require('express'),
	MaintenanceAccount 		= require('./models/maint-acct'),
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var MaintenanceAccounts = Bookshelf.Collection.extend({
	model: MaintenanceAccount
});

// application routing
var router = module.exports = express.Router();

// middleware to use for all requests
router.use(function(req, res, next){
	// do logging
	console.log('Maintenance Account is happening...');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:3002/api)
router.get('/', function(req, res){
	res.json({message: 'Welcome to MaintenanceAccount module api'});
});

// more routes for the API will happen here

// on routes that end in /maintenance-accounts
// ---------------------------------------------------------------------
router.route('/maintenance-accounts')
	// get all the maintenance account records (accessed at GET http://localhost:3002/api/maintenance-accounts)
	.get(function(req, res){
		MaintenanceAccounts.forge().fetch()
			.then(records => res.json(records))
			.catch(err => res.send(err));
	})


//router.route('/maintenance-accounts').get(maintenance_account_list);  // fetches all records
//router.route('/users').post(new_user); // creates a new user
//router.route('/users/:id').get(user_obj); // fetch an user's details
//router.route('/users/:id').put(update_user_obj); // update user's details
//router.route('/users/:id').delete(delete_user_obj); // delete an user

//router.route('/sessions/create').post(login_user);


// on routes that end in /maintenance-accounts
// -----------------------------------------------------------------



/*
// private functions
var retrieved_maintenance_accounts = null;  // yet to retrieve records

(function retrieved_maintenance_accounts(){
	console.log('Retrieve Maintenance Account List');
	MaintenanceAccounts.forge().fetch()
		.then(fetch_success)
		.catch(fetch_error);
//	var result = {error:true, data:{message: 'Incomplete Retrieve'}};

	function fetch_success(collection){
		console.log('Maintenance Account Fetch Success...');
		retrieved_maintenance_accounts = { error: false, data: collection.toJSON() };
	}
	function fetch_error(err){
		console.log('maintenance account fetch error...');
		console.log(err);
		retrieved_maintenance_accounts = { error: true, data: {message: err.message} };
	}
//	return result;
})();

// functions referred in router above

function maintenance_account_list(request, response){
	console.log('Get Maintenance Account List');
	MaintenanceAccounts.forge().fetch()
		.then(fetch_success)
		.catch(fetch_error);

	function fetch_success(collection){
		console.log('User Fetch Success...');
		response.json({error: false, data: collection.toJSON()});
	}
	function fetch_error(err){
		console.log('User error...');
		console.log(err);
		response.status(500).json({error: true, data: {message: err.message}});	
	}

}
*/


/*
function new_user(request, response){

	console.log('New user being added...');
	console.log(request.body);
	console.log(request.query);

	User.forge({
		name: request.body.userName,
		first_name: request.body.firstName,
		last_name: request.body.lastName,
		email: request.body.email,
		password: bcrypt.hashSync(request.body.password, 10),
	})
	.save()
	.then(new_user_success)
	.catch(new_user_error);

	function new_user_success(user){
		//response.json({error: false, data:{id: user.get('id')}});
		response.json({error: false, data:{user}});
	}
	function new_user_error(err){
		response.status(500).json({error: true, data:{message:err.message}});
	}

}

function user_obj(request, response){
	console.log('Request object is: ');
	console.log(request);
	User.forge({id: request.params.id})
		.fetch()
		.then(user_obj_success)
		.catch(user_obj_error);

	function user_obj_success(user){
		if(!user){
			console.log('No user found');
			response.status(404).json({error: true, data:{}});
		} else {
			console.log('user is found');
			console.log(user);
			response.json({error: false, data: user.toJSON()});
		}
	}

	function user_obj_error(err) {
		console.log('Error in finding user');
		console.log(err);
		response.status(500).json({error: true, data:{message: err.message}});
	}

}

function update_user_obj(request, response){
	User.forge({id: request.params.id}).fetch({require: true})
		.then(update_user_obj_success)
		.catch(update_user_obj_error);

	function update_user_obj_success(user){
		user.save({
			name: request.body.name || user.get('name'),
			email: request.body.email || user.get('email')
		}).then(function(){
			response.json({error: false, data:{message: 'User details updated'}});
		})
		.catch(function(){
			response.status(500).json({error: true, data: {message: err.message}});
		});
	}
	function update_user_obj_error(err){
		response.status(500).json({error: true, data: {message: err.message}});
	}

}

function delete_user_obj(request, response){
	User.forge({id: request.params.id}).fetch({require: true})
		.then(delete_user_obj_success)
		.catch(delete_user_obj_error);

	function delete_user_obj_success(user){
		user.destroy()
			.then(function(){
				response.json({error: true, data: {message: 'User successfully deleted'} });
			})
			.catch(function(err){
				response.status(500).json({error: true, data: {message: err.message}});
			});
	}
	function delete_user_obj_error(err){
		response.status(500).json({error: true, data: {message: err.message}});
	}
}


*/