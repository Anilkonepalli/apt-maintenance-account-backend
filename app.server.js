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

//app.use('/api/maintenance-accounts', require('./accounts/maint-acct-routes'));
//app.use('/api/roles', require('./authorization/role-routes'));
//app.use('/api/permissions', require('./authorization/permission-routes'));


let jwt = require('./authentication/verify.token');
app.use(jwt.verifyToken);	

///////////////////////  USER ROUTES  /////////////////////////////////

let user = require('./users/user-routes');
/*
app.route("/api/users/roles/myroles/:id")
	.put(user.putMyRoles);

app.route("/api/users/rolesfor/:id")
	.get(user.getRoles); */

app.route("/api/users/myroles/:id")
	.get(user.getRoles)
	.put(user.putRoles);

app.route("/api/users/mypermissions/:name")
	.get(user.getPermissions);

app.route("/api/users/")
	.get(user.getAll)
	.post(user.post);

app.route("/api/users/:id")
	.get(user.get)
	.delete(user.del)
	.put(user.put);
		
/////////////////////////  ACCOUNT ROUTES  //////////////////////////////		

let account = require('./accounts/maint-acct-routes');

app.route("/api/maintenance-accounts")
	.get(account.getAll)
	.post(account.post);		

app.route("/api/maintenance-accounts/:id")
	.get(account.get)
	.delete(account.del)
	.put(account.put);


/////////////////////////  ROLES ROUTES  //////////////////////////////		

let role = require('./authorization/role-routes');

app.route("/api/roles/myPermissions/:id")
	.get(role.getPermissions)
	.put(role.putPermissions);

app.route("/api/roles")
	.get(role.getAll)
	.post(role.post);		

app.route("/api/roles/:id")
	.get(role.get)
	.delete(role.del)
	.put(role.put);



/////////////////////////  PERMISSIONS ROUTES  //////////////////////////////		

let permission = require('./authorization/permission-routes');

app.route("/api/permissions")
	.get(permission.getAll)
	.post(permission.post);		

app.route("/api/permissions/:id")
	.get(permission.get)
	.delete(permission.del)
	.put(permission.put);





//app.use('/api', require('./authentication/login-routes'));
//app.use('/api/users', require('./users/user-routes'));
//app.use('/api/maintenance-accounts', require('./accounts/maint-acct-routes'));
//app.use('/api/roles', require('./authorization/role-routes'));
//app.use('/api/permissions', require('./authorization/permission-routes'));

// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, 'development');
});

