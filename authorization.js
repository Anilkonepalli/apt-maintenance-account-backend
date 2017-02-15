var getUserPermissions = require('./userPermissionsOnResource');

/**
 * Answers a Promise with boolean value indicating 
 * authorization grants for the request - 'true' indicates granted
 * 
 * @param  {number, string} userId, resource
 * @return Promise<boolean> for 'Add'; Promise<Permission> for read/update/delete
 */
module.exports = {

	allowedList: function(userId, resource, models) { // answers list containing allowed views only
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
function allows(userId, resource, model, action) {
	
console.log('authorization process...');

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
				let permissionsWithCondition = permissions.filter(perm => {
					return perm.condition != null && perm.condition != '';
				});
				let pwcCount = permissionsWithCondition.length;

				// if permission(s) exist but has no condition, pass the model for futher processing
				if(pwcCount < 1) resolve(model);

				// permissions with no condition take precedence, hence pass the model for futher processing 
				if(pCount > pwcCount) resolve(model); 

				// evaluate condition in each of the permissionsWithCondition
				let modelJson = model.toJSON();
//console.log('Model for update is:...'); console.log(model);
				let fn;
				let data;
				let evaluatedPerms = permissionsWithCondition.filter(perm => { 	// filter for permission that 
					fn = new Function("data", perm.condition);					// evaluates its condition to true
					data = { userId: userId, ownerId: modelJson.owner_id };
					return fn(data);
				});
				evaluatedPerms.length > 0 
					? resolve(model) // if at least one condition is evaluated to true, pass the model for futher processing
					: reject(new Error('Unauthorized Access!!!')); // three !!! here; all conditions evaluated to false, return error with message
			})
			.catch(err => reject(err));
	});
	
} 


function viewables(userId, resource, models) {
	
console.log('authorization process on list...');

	return new Promise( function(resolve, reject) {
		getUserPermissions(userId, resource)
			.then(perms => {

				// find permissions with condition
				let permissionsWithCondition = perms.filter(perm => {
					return perm.condition != null && perm.condition != '';
				});
				let pwcCount = permissionsWithCondition.length;

				// if permission(s) exist but has no condition, pass the model for futher processing
				if(pwcCount < 1) resolve(models);

				let pCount = perms.length;
				// permissions with no condition take precedence, hence pass the model for futher processing 
				if(pCount > pwcCount) resolve(models);

				// evaluate condition in each of the permissionsWithCondition
				let viewables = models.filter(eachModel => {
					let modelJson = eachModel.toJSON();
					let evaluatedPerms = permissionsWithCondition.filter(perm => { 	// filter for permission that 
						let fn = new Function("data", perm.condition);					// evaluates its condition to true
						let data = { userId: userId, ownerId: modelJson.owner_id };
						return fn(data);
					});
					return evaluatedPerms.length > 0;
				});
				resolve(viewables);
			})
			.catch(err => reject(err));
	});
	
} 
