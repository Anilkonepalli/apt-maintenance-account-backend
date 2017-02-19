var express 	= require('express'),
	bodyParser 	= require('body-parser'),
	cors		= require('cors');

var	app 		= express();

// body-parser middleware for handling request variables
// parse application/json and look for raw text
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());


app.get("/", (req, res) => res.json({ message: "Welcome to Maintenance Accounts Tracking App"}));

let login = require('./authentication/login-routes');
app.route("/api/login").post(login.createSession);


let jwt = require('./authentication/verify.token');
app.use(jwt.verifyToken);	


let user = require('./users/user-routes');
app.route("/api/users/")
	.get(user.getAll)
	.post(user.post);
app.route("/api/users/:id")
	.get(user.get)
	.delete(user.delete)
	.put(user.update);
app.route("/api/users/rolesfor/:id")
	.get(user.getRoles);
app.route("/api/users/roles/myroles/:id")
	.put(user.putMyRoles);	
app.route("api/users/mypermissions/:id")
	.get(user.getPermissions);		

//app.use('/api', require('./authentication/login-routes'));
//app.use('/api/users', require('./users/user-routes'));
app.use('/api/maintenance-accounts', require('./accounts/maint-acct-routes'));
app.use('/api/roles', require('./authorization/role-routes'));
app.use('/api/permissions', require('./authorization/permission-routes'));

// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, 'development');
});

