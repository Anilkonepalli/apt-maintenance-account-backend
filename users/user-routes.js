var	User 								= require('./user-model');
var	Bookshelf 					= require('../config/database');
var getUserPermissions 	= require('../authorization/userPermissionsOnResource');
var bcrypt 							= require('bcrypt');
var auth 								= require('../authorization/authorization');
var emailer							= require('../authentication/emailer');
var randomstring				= require('randomstring');
var constants 					= require('../config/constants.json');
var knex								= Bookshelf.knex;

var Info 							  = require('./info-model');
var Role 								= require('../authorization/role-model');
var	Flat 								= require('../flats/flat-model');

var Users 	= Bookshelf.Collection.extend({
	model: User
});

var Infos = Bookshelf.Collection.extend({
	model: Info
});

var myResourceName; // possible resource names are: users, user-profile

// on routes that end in /users
// get all the user models (accessed at GET http://localhost:3002/api/users)
// ---------------------------------------------------------------------
function getAll(req, res) {
	Users.forge().fetch({withRelated: ['infos']})
		.then(models => res.json(models))
		.catch(err => res.send(err));
}

// on routes that end in /users/:id to get an user
// ---------------------------------------------------------------------
function get(req, res) {
	if(req.params.id === '0') { // respond with a new user model
		res.json(new User());
	} else { // respond with fetched user model
		User.forge( {id: req.params.id} ).fetch({withRelated: ['infos']})
			.then(model => res.json(model))
			.catch(err => res.send(err));
	}
}

// on routes that end in /users/myinfos/:id to get an User with associated infos
// Note: Below function is redundant as get on User fetches infos; so below method
// is not used for now.
// ---------------------------------------------------------------------
function getInfos(req,res) {
	User.forge( {id: req.params.id} ).fetch({withRelated: ['infos']})
		.then(model => {
			let modelJson = model.toJSON();
			res.json(modelJson.infos);
		})
		.catch(err => res.send(err));
}

// on routes that end in /Users/myroles/:id to get an User with associated roles
// ---------------------------------------------------------------------
function getRoles(req,res) {
	User.forge( {id: req.params.id} ).fetch({withRelated: ['roles']})
		.then(model => {
			let modelJson = model.toJSON();
			res.json(modelJson.roles);
		})
		.catch(err => res.send(err));
}

// on routes that end in /Users/allpermissions to get all permissions of user
// ---------------------------------------------------------------------
function getAllPermissions(req, res) {
	let userId = req.decoded.id;
	logger.debug('getAllPermissions(..)..userId is: '+userId);
	getUserPermissions(userId)
		.then(perms => res.json(perms))
		.catch(err => res.send(err));
}

// on routes that end in /Users/mypermissions/:name to get permissions of 'name' module
// ---------------------------------------------------------------------
function getPermissions(req, res) {
	let userId = req.decoded.id;
	let resource = req.params.name;
	getUserPermissions(userId, resource)
		.then(perms => res.json(perms))
		.catch(err => res.send(err));
}

// on routes that end in /users/:id to update an existing user
// ---------------------------------------------------------------------
function put(req, res) {
	myResourceName = 'users';
	return putCommon(req, res);
}

// on routes that end in /users/myinfos/:id to update an existing User with my infos
function putProfile(req, res) {
	myResourceName = 'user-profile';
	return putCommon(req, res);
}

function putCommon(req, res){
	let userName = req.body.name;
	let firstName = req.body.first_name;
	let lastName = req.body.last_name;
	let email = req.body.email;
	let password = req.body.password;
	let infos = req.body.infos;
	let isSocial = false; // is the user logged in through social network
	let oldModel;
	let residentTypeInfo = {
		added: false,
		changed: false,
		deleted: false,
		value: ''
	};
	let flatNumberInfo = {
		added: false,
		changed: false,
		deleted: false,
		value: '',
		oldValue: '',
		blockNumber: '',
		flatNumber: '',
		oldBlockNumber: '',
		oldFlatNumber: ''
	};
	let userId = req.params.id;
	let residentsInDB = [];
	let flatsDB = [];

	User
		.forge({id: req.params.id})
		.fetch({require: true, withRelated: ['infos', 'roles']})
		.then(doAuth)
		.then(checkForDuplicate)
		.then(doUpdate)
		.then(updateInfos)
		.then(getResident) // on profile page, change in residentType or Flat number
											 // are taken into account in enabling crud operations in
											 // 'residents' and 'FlatToResidentsLink' tables. So,when a newly
											 // a new user tries to resident type and flat_number,
											 // those tables are updated; enabling them to see their own
											 // records in 'Residents' menu option. Hence, Admin
											 // involvement in setting up such records are avoided.
		.then(crudResident) // crud refers to create, read, update, delete
		.then(getResident) // get again for updated resident
		.then(getFlat)
		.then(linkFlatToResident)
		.then(getRoles)
		.then(linkUserToRole)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(model) {
		this.model = model;
		oldModel = model
		this.isSocial = this.model.toJSON().social_network_id !== null;
		return auth.allowsEdit(req.decoded.id, myResourceName, model);
	}
	function checkForDuplicate(granted){ // implementing inner function1
		logger.debug('checkForDuplicate(....)!!');
		logger.debug('granted....'+granted);
		logger.debug('email....'+email);
		logger.debug('this.email....'+this.email);
		logger.debug('req.body.email....'+req.body.email);
		if(this.isSocial) {// no dup check for social user, so just return count as 0 (zero)
			this.email = null; // nullify any email string found in the request parameter
			return new Promise((resolve) => resolve(0));
		}
		if(this.model.toJSON().email === req.body.email) // no dup check if no change in email, just return 0 (zero)
			return new Promise((resolve) => resolve(0));
		return User
			.where({ email: req.body.email })
		  .count('id'); // returns Promise containing count
	}
	function doUpdate(count){
		logger.debug('count is: '+count);
		if(count) {
		 throw new Error('Duplicate Error!! email-id already exists!!');
	 	}
		logger.debug('/api/users >> put()...updating user details');
		let encyptedPassword = password ? bcrypt.hashSync(password, 10) : password;
		return this.model.save({
			name: userName || this.model.get('name'),
			first_name: firstName || this.model.get('first_name'),
			last_name: lastName || this.model.get('last_name'),
			email: email || this.model.get('email'),
			password: encyptedPassword || this.model.get('password')
		});
	}

	function updateInfos() {
		let promises = [];
		logger.debug('Updating Infos....'); logger.debug(req.body.infos);
		req.body.infos && req.body.infos.forEach(eachUi => handleUserInfo(eachUi, promises, this.model))
		return Promise.all(promises);
	}
	function handleUserInfo(eachUi, promises=[], model) {
		let infos = model.toJSON().infos;
		logger.debug('Infos in db...'); logger.debug(infos);
		let existingInfo = infos.filter(eachDb => eachDb.key === eachUi.key);
		logger.debug('Existing Info..'); logger.debug(existingInfo);
		if(existingInfo.length > 0){ // info exists in db, check whether it is changed
			handleInfoChanges(eachUi, existingInfo[0], promises, model)
		} else { // no info in db, so add one
			handleInfoAddition(eachUi, promises, model)
		}
	}
	function setInfoStatus(userInfo, action, oldValue=null) {
		switch(userInfo.key) {
			case 'residentType':
				residentTypeInfo[action] = true;
				residentTypeInfo.value = userInfo.value;
				residentTypeInfo.oldValue = oldValue
				break;
			case 'flatNumber':
				flatNumberInfo[action] = true;
				flatNumberInfo.value = userInfo.value;
				flatNumberInfo.oldValue = oldValue;
				break;
			default:
				break;
		}
	}
	function handleInfoChanges(eachUi, existingInfo, promises=[], model) {
		let aPromise = null
		if(!eachUi.value){ // info is null or empty, then remove from db
			logger.debug('Removing empty info...'); logger.debug(eachUi);
			aPromise = deleteInfo(model.id, eachUi.key)
			setInfoStatus(eachUi, 'deleted', existingInfo.value)
		} else if(existingInfo.value !== eachUi.value) { // value modified w.r.t. value in db
			logger.debug('Updating modified info...old value: '+existingInfo.value+', to new value: '+eachUi.value);
			aPromise = saveInfo(model.id, eachUi.key, eachUi.value)
			setInfoStatus(eachUi, 'changed', existingInfo.value)
		}
		if(aPromise) {
			promises.push(aPromise)
		}
	}
	function handleInfoAddition(eachUi, promises, model) {
		eachUi['user_id'] = model.id;
		if(!eachUi.value) {
			logger.debug(`Info ${eachUi.key} is NOT ADDED as its value is null`)
			return ;
		}
		logger.debug('adding new info...'); logger.debug(eachUi);
		let aPromise = knex('infos').insert(eachUi);
		promises.push(aPromise);
		setInfoStatus(eachUi, 'added')
	}
	function deleteInfo(userId, key) {
		return knex('infos')
						.where('user_id', '=', userId)
						.andWhere('key', '=', key)
						.del();
	}
	function saveInfo(userId, key, value) {
		return knex('infos')
						.where('user_id', '=', userId)
						.andWhere('key', '=', key)
						.update({
							value: value
						});
	}
	function getResident() {
		return knex('residents')
			.where('first_name', '=', firstName)
			.andWhere('last_name', '=', lastName)
	}
	function determineResidentDates() {
		let occupiedOn = '';
		let vacatedOn = '';
		logger.debug(constants.defaultDatesEnabled?'Default Dates Enabled': 'DefaultDates NOT enabled')
		if(residentTypeInfo.value === "owner" && constants.defaultDatesEnabled) { // for owner occupation and vacation dates are fixed
			occupiedOn = constants.defaultOccupationDate;
			vacatedOn = constants.defaultVacateDate;
		} else { // for tenant, occupation date is taken as current date and vacation date is 2 years from current date
				let occuDate = new Date();
				let occuYear = occuDate.getFullYear();
				logger.debug(`average years of stay ${constants.averageYearsOfStay}`)
				let vacaYear = occuYear + constants.averageYearsOfStay;
				let mo = occuDate.getMonth();
				if (mo < 10) mo = '0' + mo;
				occupiedOn = `${occuYear}-${mo}-01`;
				vacatedOn = `${vacaYear}-${mo}-01`;
		}
		return {"fromDate": occupiedOn, "toDate": vacatedOn};
	}
	function crudResident(residents) {
		residentsInDB = residents;
		residentExistInDB = residents.length == 1
		logger.debug('user-routes >> updateResidents()...............')
		logger.debug('residents are: '); logger.debug(residents.length);logger.debug(residents);
		if( (residentTypeInfo.added && !residentExistInDB) ||
				(residentTypeInfo.changed && !residentExistInDB)
		) {
			logger.debug('for residentType, new row in residents table is added!!')
			let residentDates = determineResidentDates();
			return knex('residents').insert({
				first_name: firstName,
				last_name: lastName,
				is_a: residentTypeInfo.value,
				owner_id: userId,
				occupied_on: residentDates.fromDate,
				vacated_on: residentDates.toDate
			});
		}
		if(residentTypeInfo.changed &&
				residentExistInDB &&
				['owner', 'tenant'].includes(residentTypeInfo.value) // 'owner', 'tenant' type has records in residents table
			) {
				logger.debug('for residentType, row in residents table is updated!!!')
				return knex('residents')
					.where('first_name', '=', firstName)
					.andWhere('last_name', '=', lastName)
					.update({
						is_a: residentTypeInfo.value
					})
		}
		if(residentTypeInfo.changed &&
				residentExistInDB &&
				residentTypeInfo.value === 'NA' // 'NA' cannot have a row in residents table
			) {
					let promises = []
					logger.debug('for residentType, row in residents table is deleted')
					let aPromise = knex('flats_residents')
											.where('resident_id', '=', residentsInDB[0].id)
											.del();
					promises.push(aPromise)
					aPromise = knex('residents')
						.where('first_name', '=', firstName)
						.andWhere('last_name', '=', lastName)
						.del();
					promises.push(aPromise)
					return Promise.all(promises)
				}
		logger.debug('above conditions not satisfied.....');
		logger.debug('residentTypeInfo: ')
		logger.debug(residentTypeInfo);
		logger.debug('flatNumberInfo: ')
		logger.debug(flatNumberInfo)
		logger.debug('resident exists in DB?'); logger.debug(residentExistInDB?'Yes':'No');
		logger.debug('first name: '); logger.debug(firstName);
		logger.debug('last name: '); logger.debug(lastName);
		return new Promise(resolve => resolve(true))
	}
	function getParts(flatNum, separator=' ') {
		let parts = flatNum.split(' ')
		let result = {
			block_number: '',
			flat_number: ''
		}
		if(parts.length == 2) {
			result = {
				block_number: parts[0],
				flat_number: parts[1]
			}
		} else if(parts.length == 1) {
			result = {
				flat_number: parts[0]
			}
		}
		return result
	}
	function isEqual(flatString, aFlat, separator=' ') {
		logger.debug('user-routes >> isEqual(..)');
		let parts = flatString.split(separator)
		if(parts.length == 1 && aFlat.flat_number === parts[0]) {
			return true
		}
		if(parts.length == 2 &&
			aFlat.block_number === parts[0] &&
			aFlat.flat_number === parts[1]
		){
			return true
		}
		return false
	}
	function getFlat(residents) {
		residentsInDB = residents
		let promises = [];
		let aPromise = null;
		if( flatNumberInfo.added ||
			flatNumberInfo.changed ||
			(residentTypeInfo.changed &&
				['owner', 'tenant'].includes(residentTypeInfo.value))
		) {
			let data = getParts(flatNumberInfo.value)
			aPromise = Flat.forge(data).fetch({withRelated: ['residents']})
			promises.push(aPromise)
		}
		if (flatNumberInfo.deleted || flatNumberInfo.changed){
			let data = getParts(flatNumberInfo.oldValue)
			aPromise = Flat.forge(data).fetch({withRelated: ['residents']})
			promises.push(aPromise)
		}
		return Promise.all(promises);
	}
	function asDateObject(dtStr) {
	  let dtArr = dtStr.split('-')
	  let dtObj = new Date()
	  dtObj.setFullYear(dtArr[0])
	  dtObj.setMonth(dtArr[1])
	  dtObj.setDate(dtArr[2])
	  return dtObj
	}
	function activeResident(aResident) {
		// if empty, consider them as active resident
		if(!aResident.occupied_on && !aResident.vacated_on) {
			return true;
		}
		let startDate = asDateObject(aResident.occupied_on);
		let endDate = asDateObject(aResident.vacated_on);
		let today = new Date();
		if(today >= startDate && today <= endDate) {
			logger.debug(`${aResident.id} is a resident now`);
		} else {
			logger.debug(`Resident ${aResident.id} is not a resident now`);
		}
	}
	function doesExceedMaxLimit(flat, resident) {
		let maxTenants = flat.max_tenants;
		let maxOwners = flat.max_owners;
		logger.debug(`Flat Max Owners: ${maxOwners} and Max Tenants: ${maxTenants}`)
		let residingOwners = flat.residents.filter(each =>
			each.is_a === 'owner' && activeResident(each));
		let residingTenants = flat.residents.filter(each =>
			each.is_a === 'tenant' && activeResident(each));
		let msg = `Cannot add online ${resident.is_a}s exceeds limit`;
		if(resident.is_a === 'tenant' && residingTenants.length >= maxTenants) {
			logger.debug(msg);
			logger.debug(`No. of tenants ${residingTenants.length} exceeds limit of ${maxTenants}`);
			return true;
		} else if(resident.is_a === 'owner' && residingOwners.length >= maxOwners) {
			logger.debug(`No. of owners ${residingOwners.length} exceeds limit of ${maxOwners}`);
			return true;
		}
		return false;
	}
	function linkFlatToResident(flats) {
		logger.debug('No. of flats:', flats.length);
		let existing = [];
		// make link
		// not deleted or not changed (in other words, added or not changed)
		if( (!flatNumberInfo.deleted || !flatNumberInfo.changed ) && flats.length == 1 && residentsInDB.length == 1 && flats[0]) {
			logger.debug('First If condition');
			let resident = residentsInDB[0];
			let flat = flats[0].toJSON();
			logger.debug(flat);
			let msg = `Cannot add, as no. of online ${resident.is_a} exceeds limit`;
			if(doesExceedMaxLimit(flat, resident)) {
				throw new Error(msg)
			}
			existing = flat.residents.filter(each => each.id == resident.id)
			logger.debug(`No. of existing resident is ${existing}`);
			// add link
			if(existing.length == 0) {
				logger.debug(`Linking flat ${flat.id} to resident ${resident.id}...`)
				flats[0].residents().attach(resident.id)
			} else {
				logger.debug(`Cannot add a link as a link on flat ${flat.id} to resident ${resident.id} already exists`)
			}
			return Promise.resolve(true);
		}
		// remove link
		if(flatNumberInfo.deleted && flats.length == 1 && residentsInDB.length == 1 && flats[0]) {
			logger.debug(`Second If condition`);
			let resident = residentsInDB[0]
			let flat = flats[0].toJSON()
			logger.debug(flat);
			existing = flat.residents.filter(each => each.id == resident.id)
			logger.debug(`No. of existing resident is ${existing}`);
			if(existing.length == 1) {
				logger.debug(`De-Linking flat ${flat.id} to resident ${resident.id}...`)
				flat[0].residents().detach(resident.id)
			} else {
				logger.debug(`Cannot De-link, as there is no link exist on flat ${flat.id} to resident ${resident.id}`)
			}
			return Promise.resolve(true);
		}
		// Update link
		if(flatNumberInfo.changed && flats.length == 2 && residentsInDB.length == 1 && flats[0] && flats[1]) {
			logger.debug(`Third If condition`);
			let resident = residentsInDB[0];
			let first = flats[0].toJSON();
			let second = flats[1].toJSON();
			let newFlat = null;
			let oldFlat = null;
			let newFlatDB = null;
			let oldFlatDB = null;
			if( isEqual(flatNumberInfo.value, first) ) {
					newFlat = first;
					oldFlat = second;
					newFlatDB = flats[0];
					oldFlatDB = flats[1];
			} else {
				newFlat = second;
				oldFlat = first;
				newFlatDB = flats[1];
				oldFlatDB = flats[0];
			}
			let msg = `Cannot change, as no. of online ${resident.is_a}s exceeds limit`;
			if(doesExceedMaxLimit(newFlat, resident)) {
				throw new Error(msg)
			}
			let promises = []
			let aPromise = null;
			existing = oldFlat.residents.filter(each => each.id == resident.id);
			logger.debug(`No. of existing oldFlat resident is ${existing}`);
			if(existing.length == 1) {
				logger.debug(`De-Linking flat ${oldFlat.id} to resident ${resident.id}...`)
				oldFlatDB.residents().detach(resident.id)
			} else {
				logger.debug(`Cannot De-link, as there is no link exist on flat ${oldFlat.id} to resident ${resident.id}`)
			}
			existing = newFlat.residents.filter(each => each.id == resident.id);
			logger.debug(`No. of existing newFlat resident is ${existing}`);
			if(existing.length == 0) {
				logger.debug(`Linking flat ${newFlat.id} to resident ${resident.id}...`)
				newFlatDB.residents().attach(resident.id)
			} else {
				logger.debug(`Cannot add a link as a link on flat ${newFlat.id} to resident ${resident.id} already exists`)
			}
			return Promise.resolve(true)
		}
		logger.debug('No link is added/updated/deleted on FlatToResident...')
		return Promise.resolve(false);
	}
	function getRoles() {
		return knex.select().table('roles');
	}
	function linkUserToRole(roles) {
		logger.debug('user-routes >> linkUserToRole');
		logger.debug('residentTypeInfo: ', residentTypeInfo);
		let roleNameNew = (residentTypeInfo.value === 'NA' ||
		 										residentTypeInfo.value === null) ?
											 'guest' : residentTypeInfo.value;
		let roleNameOld = (residentTypeInfo.oldValue === 'NA' ||
		 										residentTypeInfo.oldValue === null) ?
											 'guest' : residentTypeInfo.oldValue;
		let roleNew = roles.find(each => each.name === roleNameNew);
		let roleOld = roles.find(each => each.name === roleNameOld);
		if(roleNew && roleOld) { // if both old and new roles available, proceed
			logger.debug(`Detaching old role id ${roleOld.id} and Attaching new role id ${roleNew.id} in the users-roles link table`);
			this.model.roles().detach(roleOld.id);
			this.model.roles().attach(roleNew.id);
		} else {
			logger.debug('No link added/changed/deleted on UserToRole')
		}
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'User profile updated'}});
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}


// on routes that end in /users/myinfos/:id to update an existing User with my infos
// Note: Below function is not used as the behavior is covered while saving/updating
// User
// --------------------------------------------------------------------------------------------
function putInfos(req, res) {

	let userModel;
	logger.debug('Inside user-routes >> putInfos(req,res)...');
	logger.debug('req params id: '+req.params.id);
	User.forge({id: req.params.id}).fetch({require: true})
		.then(detachExistingInfos)
		.then(attachNewInfos)
		.then(sendResponse)
		.catch(errorToNotify);

	function detachExistingInfos(model){
		userModel = model;
		logger.debug('Inside user-routes >> detachExistingInfos(model)...');
		logger.debug(model.toJSON());
		return knex('infos').where('user_id', req.params.id).del(); // it deletes all rows where user_id = req.params.id
	}

	function attachNewInfos(delResult){
		logger.debug('inside user-routes >> attachNewInfos(model)...');
		logger.debug(userModel.toJSON());
		let promises = [];
		JSON.parse(req.body.myInfos).forEach(each => {
			promises.push( knex('infos').insert(each) );
		});
		return Promise.all(promises);
	}

	function sendResponse(aColl) {
		logger.debug('Inside user-routes >> putInfos() >> sendResponse(aColl)...');
		res.json({error:false, data:{ message: 'My Infos are attached'}});
	}

	function errorToNotify(err){
		logger.error(err);
		res.status(500).json({error: true, data: {message: err.message}});
	}

}

// on routes that end in /roles/myroles/:id to update an existing User with myroles
// --------------------------------------------------------------------------------------------
function putRoles(req, res) {

	let userModel;
	logger.debug('Inside user-routes >> putRoles(req,res)...');
	logger.debug('req params id: '+req.params.id);
	retrieveModelWithRoles()
		.then(doAuth)
		.then(detachExistingRoles)
		.then(attachNewRoles)
		.then(retrieveModelWithRoles)
		.then(sendResponse)
		.catch(errorToNotify);

	function retrieveModelWithRoles() {
		logger.debug('retrieving role with permissions');
		return User.forge({id: req.params.id}).fetch({require: true, withRelated:['roles']})
	}

	function doAuth(model) {
		this.userModel = model;
		return auth.allowsEdit(req.decoded.id, 'users-roles', model); // check whether logged user is allowed to Edit users-roles link
	}

	function detachExistingRoles(granted){
		let model = this.userModel;
		logger.debug('Inside user-routes >> detachExistingRoles(model)...');
		logger.debug(model.toJSON());
		return model.roles().detach();
	}

	function attachNewRoles(){
		logger.debug('inside user-routes >> attachNewRoles(model)...');
		logger.debug(req.body.myrolesIds)
		return this.userModel.roles().attach(req.body.myrolesIds); // attach new roles
	}

	function sendResponse(model) {
		let modelJson = model.toJSON();
		logger.debug('inside user-routes >> sendResponse(model)')
		logger.debug(modelJson.roles)
		res.json(modelJson.roles);
	}

	function errorToNotify(err){
		logger.error(err);
		res.status(500).json({error: true, data: {message: err.message}});
	}

}

// on routes that end in /users to post (to add / register ) a new user
// ---------------------------------------------------------------------
function post(req, res) {
	logger.debug('adding new user...name: '+req.body.name+', first name: '+req.body.first_name);
	logger.debug('request protocol: ', req.protocol)
	logger.debug('host is: ', req.get('host'))
	logger.debug('originnal url: ', req.originalUrl)
	let model = null;

	getTotalForMaxCheck()
	.then(getCountForDupCheck)
	.then(doSave)
	.then(addInfos)
	.then(getDefaultRole)
	.then(attachDefaultRole)
	.then(sendResponse)
	.catch(errorToNotify);

	function getTotalForMaxCheck() {
		let tableName = User.prototype.tableName;
		if(constants.maxRecordsDisabled) {
			logger.debug('Max Records DISABLED!');
			return new Promise((resolve) => resolve(''));
		}
		logger.debug('Max Records ENABLED');
		return Bookshelf.knex(tableName).count('id as CNT');
	}

	function getCountForDupCheck(total) {
		if(total && total[0].CNT >= constants.maxRecords.users) {
			let msg = 'Maximum Limit Reached! User registration is closed';
			throw new Error(msg);
		}
		return User
		.where({ email: req.body.email })
		.count('id'); // returns Promise containing count
	}

	function doSave(count) {
		if(count) {
			let msg = 'Duplicate Error! email-id already exists!';
			throw new Error(msg);
		}
		logger.debug('/api/users >> post()...saving new user profile');
		return User.forge({
			name: req.body.name,
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 10),
			confirmation_code: randomstring.generate(50)
		}).save();
	}
	function addInfos(model){
		this.model = model;
		logger.debug('infos...');
		logger.debug(req.body.infos);
		let promises = [];
		req.body.infos && req.body.infos.forEach(each => {
			each['user_id'] = model.id;
			logger.debug(each);
			promises.push( knex('infos').insert(each) );
		});
		return Promise.all(promises);
	}
	function getDefaultRole(prevResp) {
		console.log('user-routes >> getDefaultRole(prevResp) ', prevResp)
		return new Role({'name': process.env.defaultRole}).fetch(); // default role is 'guest'
	}
	function attachDefaultRole(aRole) {
		console.log('user-routes >> attachDefaultRole(aRole) ', aRole)
		return this.model.roles().attach(aRole.id)
	}
	function sendResponse(model) {
		let can_send_email = process.env.can_send_email === 'true';
		res.json({error: false, data:{emailed: can_send_email}});
		let protocol = req.secure ? 'https': 'http';
		let host = req.get('host')
		let originalUrl = req.originalUrl
		let modelJson = this.model.toJSON();
		let signupUrl = protocol + '://' + host
		let confirmUrl = signupUrl + '/registration-confirm/' + modelJson.confirmation_code

		let template = {
			subject: 'Thank you for signing up with Raj-n-Gothai Nivas!',
			body: '',
			html: 'This email is sent as part of signup process at '+ signupUrl + '.'
							+ ' To complete signup process, please click on the below link: <br><br>'
							+ '<a href="' + confirmUrl + '">' + confirmUrl + '</a>'
							+ '.<br><br><i>If the link does not work, copy and paste it into browser url.</i><br>'
							+ 'In case no such signup process is initiated, please ignore this email'
		};
		logger.debug('Template is: ');
		logger.debug(template);
		logger.debug('confirmation_code: '+modelJson.confirmation_code);
		logger.debug(modelJson);
		emailer.sendMailTo(req.body.email, template);
	}

	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}

// on routes that end in /users/:id to delete an user
// ---------------------------------------------------------------------
function del(req, res) { // using full form 'delete' causes error, so 'del' is used
	let model;
	logger.debug('Inside user.routes >> del(req,res).............');
	User.forge({id: req.params.id}).fetch({require: true, withRelated:['infos']})
		.then(doAuth)
		.then(getDependants)
		.then(deleteDependants)
		.then(doDeleteUser)
		.then(sendResponse)
		.catch(errorToNotify);

	function doAuth(model) {
		this.model = model;
		logger.debug('user routes >> doAuth(model).................')
		return auth.allowsDelete(req.decoded.id, 'users', model); // check whether logged user is allowed to Delete role model
	}

	// for now, a work around to delete dependants is done here
	function getDependants(granted){ // yet to explore a better way to delete dependants with soft delete
		logger.debug('user routes >> getDependants(granted)...................id: '+this.model.id)
		return Infos.forge({user_id: this.model.id}).fetch({require: false}); // require is set to false, so that EmptyResponse/NotFoundError, if any, is rejected
	}

	function deleteDependants(infos){
		logger.debug('user routes >> deleteDependants(infos).................')
		let promises = [];
		infos.forEach(each => {
			promises.push( each.destroy() );
		});
		return Promise.all(promises);
	}

	function doDeleteUser(){
		logger.debug('user routes >> doDeleteUser() .......................');
		return this.model.destroy();
	}

	function sendResponse() {
		return res.json({error: true, data: {message: 'User model successfully deleted'}});
	}

	function errorToNotify(err){
		logger.error(err);
		res.status(500).json({error: true, data: {message: err.message}});
	}

}

// on routes that end in /api/signup/:code to confirm newly registered User
// --------------------------------------------------------------------------------------------
function confirmSignup(req, res) {

	let model;

	checkForRecord()
		.then(fetchRecord)
		.then(updateStatus)
		.then(sendResponse)
		.catch(errorToNotify);

	function checkForRecord() {
		return User
			.where({confirmation_code: req.params.code})
			.count('id'); // returns Promise containing count
	}
	function fetchRecord(count) {
		if(!count) {
			throw new Error('Invalid code!');
		}
		return User
			.forge({confirmation_code: req.params.code})
			.fetch({require: true});
	}
	function updateStatus(model) {
		logger.debug('inside user-routes >> updateStatus for model: ');
		logger.debug(model);
		this.model = model;
		return this.model.save({
			confirmed: 1,
			confirmation_code: null
		});
	}
	function sendResponse() {
		return res.json({error: false, data:{message: 'Signup process is now completed!'}});
	}
	function errorToNotify(err) {
		logger.error(err);
		return res.status(500).json({error: true, data: {message: err.message}});
	}

}

module.exports = { getAll, post, get, put, del, putProfile, getInfos, putInfos, getRoles, putRoles, getPermissions, getAllPermissions, confirmSignup };
