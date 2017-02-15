var getUserPermissions = require('./userPermissionsOnResource');

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

	allowedList: function(userId, resource, models) { // answers list containing authorized models only
		return viewables(userId, resource, models);
	},
	allowsAdd: function(userId, resource) {
		return new Promise( function(resolve, reject) {
			getUserPermissions(userId, resource)
				.then(perms => {
					let myAddPerm = perms.find(each => each.operations.indexOf('C') > -1); // find first permission that satisfies this condition
					myAddPerm !== undefined ? resolve(true) : reject(new Error('Unauthorized Access!')); // one ! here
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
				hasEvaluatedPerms(permissionsWithCondition, modelJson, userId)
					? resolve(model)
					: reject(new Error('Unauthorized Access!!!')); // three !!! here; all conditions evaluated to false, return error with message
			})
			.catch(err => reject(err));

	});
	
} 

/**
 * Answers filtered out models that are view authorized
 * @param  {number} userId 
 * @param  {string} resource 
 * @param  {[Any]} models 
 * @return {Promise<[Any]>}
 */
function viewables(userId, resource, models) {
	
	return new Promise( function(resolve, reject) {

		getUserPermissions(userId, resource)
			.then(perms => {

				// find permissions with condition
				let permissionsWithCondition = pwc(perms);
				let pwcCount = permissionsWithCondition.length;

				// if permission(s) exist but has no condition, pass the model for futher processing
				if(pwcCount < 1) resolve(models);

				let pCount = perms.length;
				// permissions with no condition take precedence, hence pass the model for futher processing 
				if(pCount > pwcCount) resolve(models);

				// evaluate condition in each of the permissionsWithCondition
				let viewables = models.filter(eachModel => {
					let modelJson = eachModel.toJSON();
					return hasEvaluatedPerms(permissionsWithCondition, modelJson, userId);
				})
				resolve(viewables);
			})
			.catch(err => reject(err));

	});
	
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
function hasEvaluatedPerms(permissionsWithCondition, modelJson, userId) {
	let evaluatedPerms = permissionsWithCondition.filter(perm => { 	// filter for permission that 
		let fn = new Function("data", perm.condition);					// evaluates its condition to true
		let data = { userId: userId, ownerId: modelJson.owner_id };
		return fn(data);
	});
	return evaluatedPerms.length > 0;
}
 
