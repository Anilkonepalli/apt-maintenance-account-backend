var express 		= require('express');
var	bodyParser 	= require('body-parser');
var	cors				= require('cors');
var winston 		= require('winston'); // logging module
				  				require('winston-daily-rotate-file');
var constants 	= require('./config/constants.json');

var	app 				= express();

var transport = new winston.transports.DailyRotateFile({
	filename: './logs/maint-acct.log',
	datePattern: 'yyyy-MM-dd-',
	prepend: true,
	level: process.env.log_level
});

global.logger = new winston.Logger({
	level: constants.logLevel,
	transports: [
		new (winston.transports.Console)({colorize: true}),
		transport
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
app.route("/api/login/reset-password").post(login.resetPassword);
app.route("/api/login/forgot-password").post(login.forgotPassword);
app.route("/api/login").post(login.createSession);

let user = require('./users/user-routes');
app.route("/api/users/").post(user.post);  // Register new user
app.route("/api/signup/:code").put(user.confirmSignup); // Confirm new user

let socialLogin = require('./authentication/social-login-routes');
app.route("/api/sociallogin").post(socialLogin.createSession);

let jwt = require('./authentication/verify.token');
app.use(jwt.verifyToken);

////////////  ALL ROUTES BELOW REQUIRES JWT, ie. User should have logged In ///////

///////////////////////  USER ROUTES  /////////////////////////////////
app.route("/api/users/myinfos/:id")
	.get(user.getInfos)
	.put(user.putInfos);

app.route("/api/users/myroles/:id")
	.get(user.getRoles)
	.put(user.putRoles);

app.route("/api/users/mypermissions/:name")
	.get(user.getPermissions);

app.route("/api/users/allpermissions/")
	.get(user.getAllPermissions);

app.route("/api/users/")
	.get(user.getAll);

app.route("/api/users/:id")
	.get(user.get)
	.delete(user.del)
	.put(user.put);


/////////////////////////  USERPROFILE ROUTES  //////////////////////////////
app.route("/api/userprofile/:id")
	.get(user.get)
	.put(user.putProfile);


/////////////////////////  ACCOUNT ROUTES  //////////////////////////////
let account = require('./accounts/maint-acct-routes');
app.route("/api/maintenance-accounts")
	.get(account.getAll)
	.post(account.post);

app.route("/api/maintenance-accounts/:id")
	.get(account.get)
	.delete(account.del)
	.put(account.put);

app.route("/api/maintenance-accounts/summary/list")
	.get(account.getSummaries);

app.route("/api/maintenance-accounts/my/accounts")
	.get(account.getMyAccounts);

/////////////////////////  ACCOUNT PERIODIC ROUTES  //////////////////////////////
let accountp = require('./accounts/maint-acct-periodic-routes');
app.route("/api/maintenance-accounts-periodic")
	.get(accountp.getAll);
app.route("/api/maintenance-accounts-for")
	.get(accountp.getMonthlyAccountsFor)

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


/////////////////////////  DURATIONS ROUTES  //////////////////////////////
let duration = require('./durations/routes')
app.route("/api/durations")
	.get(duration.getAll)
	.post(duration.post)

app.route("/api/durations-active")
	.post(duration.getActive);

app.route("/api/durations/:id")
	.get(duration.get)
	.delete(duration.del)
	.put(duration.put)

//////////// Launch NodeJS server with port #3002
app.listen(process.env.PORT, function(){
	console.log('Express server listening on port %d in %s mode', process.env.PORT, process.env.NODE_ENV);
});
