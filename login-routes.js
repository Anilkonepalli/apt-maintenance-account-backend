var _ 			= require('lodash'),
	express 	= require('express'),
	User 		= require('./models/user'),
	Role 		= require('./models/role'),
	Permission 	= require('./models/permission'),	
	Bookshelf 	= require('./config/database'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants'),
	bcrypt 		= require('bcrypt');


var Users = Bookshelf.Collection.extend({
	model: User
});
var Roles = Bookshelf.Collection.extend({
	model: Role
});
var Permissions = Bookshelf.Collection.extend({
	model: Permission
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
		id_token: jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2}),
		user: { id: user.id, firstName: user.first_name, lastName: user.last_name }
	});
	
});

// api routes

// private functions
var retrieved_roles = null; // yet to retrieve all roles 

(function retrieve_roles() {
	Roles.forge().fetch({withRelated: ['permissions']})
		.then(role_fetch_success)
		.catch(role_fetch_error);

	function role_fetch_success(allRoles){
		let roles = allRoles.toJSON();
//console.log('Roles with permissions...'); console.log(roles);		
		retrieved_roles = { error: false, data: roles};
	}
	function role_fetch_error(err){
		retrieved_roles = { error: true, data: {message: err.message} };
	}

})();


var retrieved_permissions = null; // yet to retrieve all permissions 

(function retrieve_permissions() {
	Permissions.forge().fetch()
		.then(permission_fetch_success)
		.catch(permission_fetch_error);

	function permission_fetch_success(allPermissions){
		let permissions = allPermissions.toJSON();
//console.log('All Permissions....'); console.log(permissions);
		retrieved_permissions = { error: false, data: permissions};
	}
	function permission_fetch_error(err){
		retrieved_permissions = { error: true, data: {message: err.message} };
	}

})();



var retrieved_users = null;  // yet to retrieve all users

(function retrieve_users(){

	Users.forge().fetch({withRelated: ['roles']})
		.then(user_fetch_success)
		.catch(user_fetch_error);

	function user_fetch_success(allUsers){
		let usersWithRoles = allUsers.toJSON();
//console.log('All users...'); console.log(usersWithRoles);
		usersWithRoles.forEach(eachUser => { // reduce the role object to mere its id, 
											 // so that it reduces JWT token size
			let roleIds = []; 
			eachUser.roles.forEach(eachRole => { // collect inherited role ids
				roleIds.push(eachRole.id);
				let inhIds = getInheritedIds(eachRole);
				roleIds = roleIds.concat(inhIds);
			});
			eachUser.roles = roleIds;
//console.log('Role Ids...'); console.log(roleIds);
			let permsIds = [];
			let tempIds;
//console.log('Retrieved roles...'); console.log(retrieved_roles);			
			let roles = retrieved_roles.data.filter(each => roleIds.includes(each.id));
//console.log('Role objects to attach perms...'); console.log(roles);
			roles.forEach(eachRole => { // collect permission ids
				tempIds = eachRole.permissions.map(each => each.id);
				permsIds = permsIds.concat(tempIds);
			});
console.log(' Permissions attached to User...'); console.log(permsIds);
			eachUser.permissions = permsIds;

		});
console.log('Retrieved Users: '); console.log(usersWithRoles);		
		retrieved_users = { error: false, data: usersWithRoles };
	}

	function user_fetch_error(err){
		retrieved_users = { error: true, data: {message: err.message} };
	}

	function getInheritedIds(role) {

		let inheritedIds = getIds(role.inherits);

		if(inheritedIds.length < 1){
		 	return [];
		}
		if(retrieved_roles.error){
			return [];
		}
		let inhertiedRoles = retrieved_roles.data // get roles of inherited role ids
			.filter(each => inheritedIds.includes(each.id));
		inhertiedRoles
			.forEach(each => { // check for inherits of inherits
				let idsOfIds = getInheritedIds(each); // recursive call
				inheritedIds = inheritedIds.concat(idsOfIds);
			});
		return inheritedIds;
	}

	function getIds(inherits){
		if(inherits == null || inherits == ''){
			return [];
		}
		let separator = ',';
		let arr = inherits.split(separator); // example: inherits column value '1,5,11' becomes '1', '5', '11'
		arr = arr.map(each => +each); // converts into number; example above becomes: 1, 5, 11
		return arr;
	}

	function getPermissions(roleIds) {

		let result;

		roleIds.forEach(each => {

		});

	}

})();
