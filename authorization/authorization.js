var getUserPermissions = require('./userPermissionsOnResource');
var Utility 					 = require('./utility-class');

/**
 * Answers a Promise with boolean value indicating
 * authorization grants for the request - 'true' indicates granted
 *
 * @param  {number, string} userId, resource
 * @return Promise<boolean> for 'Add';
 *         Promise<Permission> for read/update/delete
 *         Promise<Permission[]> for list
 */
module.exports = {

	allowedList: function(userId, resource, modelsJson) { // answers list containing authorized models only
		return viewables(userId, resource, modelsJson);
	},
	allowsAdd: function(userId, resource) {
		return new Promise( function(resolve, reject) {
			getUserPermissions(userId, resource)
				.then(perms => {
					let myAddPerm = perms.find(each => each.operations.indexOf('C') > -1); // find first permission that satisfies this condition
					myAddPerm !== undefined
						? resolve(true)
						: reject(new Error('Unauthorized Access!')); // one ! here
				})
				.catch(err => reject(err));
		});
	},
	allowsView: function(userId, resource, model) {
		return allows(userId, resource, model, 'R');
	},
	allowsEdit: function(userId, resource, model) {
		return allows(userId, resource, model, 'U');
	},
	allowsDelete: function(userId, resource, model) {
		return allows(userId, resource, model, 'D');
	}

}

// private functions
/**
 * Authorize a model for the given userId, resource, and action
 * @param  {number} userId
 * @param  {string} resource
 * @param  {Any} model
 * @param  {string} action
 * @return {Promise<Any>}
 */
function allows(userId, resource, model, action) {
	logger.log('debug', 'UserId: '+userId);
	logger.log('debug', 'Resource Name: '+resource);
	logger.log('debug', 'Action: '+action);
	logger.log('debug', 'model is: ');
	logger.log('debug', model);
	return new Promise( function(resolve, reject) {

		getUserPermissions(userId, resource)
			.then(perms => {
				// find permissions with granted 'action'
				let permissions = perms.filter(perm => {
					return perm.operations.indexOf(action) > -1;
				});
				let pCount = permissions.length;

				// if no permissions found, then reject it with error message
				if(pCount < 1) reject(new Error('Unauthorized Access!!')); // two !! here

				// find permissions with condition
				let permissionsWithCondition = pwc(permissions);
				let pwcCount = permissionsWithCondition.length;

				// if permission(s) exist but has no condition, pass the model for futher processing
				if(pwcCount < 1) resolve(model);

				// permissions with no condition take precedence, hence pass the model for futher processing
				if(pCount > pwcCount) resolve(model);

				// evaluate condition in each of the permissionsWithCondition
				let modelJson = model.toJSON();
				logger.log('debug', 'Authorization >> allows....Model is: ');
				logger.log('debug', modelJson);
				let noOwners = ['users', 'user-profile'];
				if(noOwners.includes(resource)){
					modelJson['owner_id'] = modelJson.id; // add an attribute for evaluation purpose
				};
				.then(getDependants)
				hasEvaluatedPerms(permissionsWithCondition, modelJson, userId)
					? resolve(model)
					: reject(new Error('Unauthorized Access!!!')); // three !!! here; all conditions evaluated to false, return error with message
			})
			.catch(err => reject(err));

	});

}

/**
 * Answers filter out models that are view authorized
 * @param  {number} userId
 * @param  {string} resource
 * @param  {[Any]} modelsJson
 * @param {class} className
 * @return {Promise<[Any]>}
 */
function viewables(userId, resource, modelsJson) {

	let permissionsWithCondition;

	return getUserPermissions(userId, resource)
		.then(canRejectConditionInPermissions)
		.then(checkForDependencies)
		.then(getDependants)
		.catch(ha ndleError);

	function handleError(err) {
		return Promise.reject(err);
	}

	function canRejectConditionInPermissions(perms){
		// if no permissions found, throw error
		if(perms.length < 1) throw new Error('No permissions on '+resource);

		// find  {permissions with condition
		permissionsWithCondition = pwc(perms);
		let pwcCount = permissionsWithCondition.length;

		// if permission(s) exist but has no condition, just return true,
		if(pwcCount < 1) return Promise.resolve(true);

		let pCount = perms.length;
		// permissions with no condition take precedence, just return true.
		if(pCount > pwcCount)	return Promise.resolve(true);

		// condition in perms cannot be rejected
		return Promise.resolve(false);
	}

	function checkForDependencies(rejected) {
		if(rejected) return Promise.resolve(modelsJson);
		let data = {
			user_id: userId,
			model: null
		}
		let flatNumbersNeeded = Utility.hasDependencies(permissionsWithCondition);
		return Promise.resolve(flatNumbersNeeded);
	}

	function getDependants(flatNumbersNeeded) {
		if(flatNumbersNeeded){
			return knex('residents').where('owner_id', '=', userId);
		} else {
			return Promise.resolve('[]');
		}
  }

		let viewables = modelsJson.filter(eachModel => {
			data.model = eachModel;
			return hasEvaluatedPerms(permissionsWithCondition, data);
		});
		logger.log('debug', 'Viewables models are: ....');
		logger.log('debug', viewables);
		return Promise.resolve(viewables);
	}


/*	return new Promise( function(resolve, reject) {

		getUserPermissions(userId, resource)
			.then(perms => {
				// if no permissions found, throw error
				if(perms.length < 1) throw new Error('No permissions on '+resource);

				// find permissions with condition
				let permissionsWithCondition = pwc(perms);
				let pwcCount = permissionsWithCondition.length;

				// if permission(s) exist but has no condition, pass the model for futher processing
				if(pwcCount < 1) resolve(modelsJson);

				let pCount = perms.length;
				// permissions with no condition take precedence, hence pass the model for futher processing
				if(pCount > pwcCount) resolve(modelsJson);
logger.log('debug', 'modelsJson: ');
logger.log('debug', modelsJson);
				let viewables = modelsJson.filter(eachModel => {
					let data = {
						user_id: userId,
						model: eachModel
					}
					return hasEvaluatedPerms(permissionsWithCondition, data);
				});
				logger.log('debug', 'Viewables models are: ....');
				logger.log('debug', viewables);
				resolve(viewables);
			})
			.catch(err => reject(err));
	});  */

}

/**
 * Answers permissions with valid condition
 * @param  {[Permission]} perms
 * @return {[Permission]}
 */
function pwc(perms) {
	return perms.filter(perm => perm.condition != null && perm.condition != '');
}

/**
 * Answers a boolean indicating whether there is at least
 * one permission whose condition is evaluated to true
 * @param  {[Permission]}  permissionsWithCondition
 * @param  {Model}  modelJson
 * @param  {number}  userId
 * @return {Boolean}
 */
function hasEvaluatedPerms(permissionsWithCondition, data) {
	let evaluatedPerms = permissionsWithCondition.filter(perm => { 	// filter for permission that
		let utility = new Utility(perm.condition, data);
		return utility.evaluate();
	});
	return evaluatedPerms.length > 0;
}
