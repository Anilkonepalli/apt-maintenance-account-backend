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
//var maintAcctRoutes = module.exports = express.Router();
var maintAcctRoutes = express.Router();


// middleware to use for all requests
maintAcctRoutes.use(function(req, res, next){
	// do logging
	console.log('Maintenance Account Access is happening...');

	let token = req.body.token || req.query.token || req.headers['x-access-token'];
	console.log('JWT Token from client: ...');
	console.log(token);

	// decode token
	if(token) {
		// verifies secret and checks exp
		jwt.verify(token, constants.secret, function(err, decoded){
			if (err) {
				return res.json({success: false, message: 'Failed to authenticate token'});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided in MaintAcctRoutes.'
		});
	}
	//next(); // make sure we go to the next routes and don't stop here
});



// more routes for the API will happen here

// on routes that end in /maintenance-accounts
// ---------------------------------------------------------------------
maintAcctRoutes.route('/')
	// get all the maintenance account records (accessed at GET http://localhost:3002/api/maintenance-accounts)
	.get(function(req, res){
		MaintenanceAccounts.forge().fetch()
			.then(records => res.json(records))
			.catch(err => res.send(err));
	});

// on routes that end in /maintenance-accounts/:id to get an account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.get(function(req, res) {
		if(req.params.id === '0') { // respond with a new account
			res.json(new MaintenanceAccount());
		} else { // respond with fetched account
			MaintenanceAccount.forge( {id: req.params.id} ).fetch()
				.then(record => res.json(record))
				.catch(err => res.send(err));
		}
	});
// on routes that end in /maintenance-accounts/:id to update an existing account
// ---------------------------------------------------------------------
maintAcctRoutes.route('/:id')
	.put(function(req, res) {
		MaintenanceAccount.forge({id: req.params.id}).fetch({require: true})
			.then(doUpdate)
			.catch(notifyError);

		function doUpdate(account){
			account.save({
				name: req.body.name || account.get('name')
			})
			.then(function(){
				res.json({error: false, data:{message: 'Account Details Updated'}});
			})
			.catch(function(){
				res.status(500).json({error: true, data: {message: err.message}});
			});
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}

	});

// on routes that end in /maintenance-accounts to post (to add) a new account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/')
	.post(function(req, res) {
		console.log('New Account being added...');
		console.log(req.body);
		console.log(req.query);

		MaintenanceAccount.forge({
			name: req.body.name,
		})
		.save()
		.then( acct => res.json({error: false, data:{acct}}))
		.catch( err => res.status(500).json({error: true, data:{message: err.message}}));
	});


// on routes that end in /maintenance-accounts/:id to delete an account
// ---------------------------------------------------------------------

maintAcctRoutes.route('/:id')
	.delete(function(req, res){
		MaintenanceAccount.forge({id: req.params.id}).fetch({require: true})
			.then(doDelete)
			.catch(notifyError);

		function doDelete(acct){
			acct.destroy()
				.then( () => res.json({error: true, data: {message: 'User successfully deleted'} }))
				.catch( (err) => res.status(500).json({error: true, data: {message: err.message}}));
		}
		function notifyError(err){
			res.status(500).json({error: true, data: {message: err.message}});
		}
	});


module.exports = maintAcctRoutes;