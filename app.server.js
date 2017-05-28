var express 	= require('express');
var	bodyParser 	= require('body-parser');
var	cors		= require('cors');
var winston 	= require('winston'); // logging module
				  require('winston-daily-rotate-file');
var constants 	= require('./config/constants.json');

var	app 		= express();

var transport = new winston.transports.DailyRotateFile({
	filename: './logs/maint-acct.log',
	datePattern: 'yyyy-MM-dd-',
	prepend: true,
	level: process.env.NODE_ENV === 'development' ? 'debug' : 'info'
});

global.logger = new winston.Logger({
	level: constants.logLevel,
	transports: [
		new (winston.transports.Console)({colorize: true}),
		transport
		//new (winston.transports.File)({ filename: constants.logFileName })
	]
});

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

let user = require('./users/user-routes');
app.route("/api/users/")
	.post(user.post);

let socialLogin = require('./authentication/social-login-routes');
app.route("/api/sociallogin").post(socialLogin.createSession);

let jwt = require('./authentication/verify.token');
app.use(jwt.verifyToken);

///////////////////////  USER ROUTES  /////////////////////////////////

//let user = require('./users/user-routes');

app.route("/api/users/myroles/:id")
	.get(user.getRoles)
	.put(user.putRoles);

app.route("/api/users/mypermissions/:name")
	.get(user.getPermissions);

/*
app.route("/api/users/")
	.get(user.getAll)
	.post(user.post);
*/

app.route("/api/users/")
	.get(user.getAll);

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


/////////////////////////  ACCOUNT PERIODIC ROUTES  //////////////////////////////

let accountp = require('./accounts/maint-acct-periodic-routes');

app.route("/api/maintenance-accounts-periodic")
	.get(accountp.getAll);


/////////////////////////  FLAT ROUTES  //////////////////////////////

let flat = require('./flats/flat-routes');

app.route("/api/flats/myresidents/:id")
	.get(flat.getResidents)
	.put(flat.putResidents);

app.route("/api/flats")
	.get(flat.getAll)
	.post(flat.post);

app.route("/api/flats/:id")
	.get(flat.get)
	.delete(flat.del)
	.put(flat.put);



	/////////////////////////  RESIDENT ROUTES  //////////////////////////////

	let resident = require('./residents/routes');

	app.route("/api/residents")
		.get(resident.getAll)
		.post(resident.post);

	app.route("/api/residents/:id")
		.get(resident.get)
		.delete(resident.del)
		.put(resident.put);



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


// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, process.env.NODE_ENV);
});
