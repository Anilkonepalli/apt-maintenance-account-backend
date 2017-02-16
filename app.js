var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	cors		= require('cors');

var	app 		= express();

// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', require('./authentication/login-routes'));
app.use('/api/users', require('./users/user-routes'));
app.use('/api/maintenance-accounts', require('./accounts/maint-acct-routes'));
app.use('/api/roles', require('./authorization/role-routes'));
app.use('/api/permissions', require('./authorization/permission-routes'));

// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, 'development');
});

