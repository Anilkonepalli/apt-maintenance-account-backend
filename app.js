var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	cors		= require('cors');

var	app 		= express();

// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', require('./login-routes'));
app.use('/api/users', require('./user-routes'));
app.use('/api/maintenance-accounts', require('./maint-acct-routes'));

// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, 'development');
});

