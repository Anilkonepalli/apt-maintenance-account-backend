var getUserPermissions = require('./userPermissionsOnResource');

/**
 * Answers a Promise with boolean value indicating 
 * authorization grants for the request - 'true' indicates granted
 * 
 * @param  {number, string} userId, resource
 * @return Promise<boolean>
 */
module.exports = {

	allowsAdd: function(userId, resource) {
		return new Promise( function(resolve, reject) {
			getUserPermissions(userId, resource)
				.then(perms => {
					let myAddPerm = perms.find(each => each.operations.indexOf('C') > -1);
					myAddPerm !== undefined ? resolve(true) : reject(new Error('Unauthorized Access!'));
				})
				.catch(err => reject(err));
		});
	},

	allowsEdit: function(userId, resource, model) {
		return allows(userId, resource, model, 'U');
/*		return new Promise( function(resolve, reject) {
			allows(userId, resource, model.owner, 'U'); // U stands for Update/Edit 
			1 == 0 ? resolve(model) : reject(new Error('Unauthorized Access!!'));
		}); */
	}

}

function allows(userId, resource, model, action) {
	
	console.log('authorization process...');

	return new Promise( function(resolve, reject) {
		getUserPermissions(userId, resource)
			.then(models => {
				// find permissions with granted 'action'
				let permissions = models.filter(perm => {
					return perm.operations.indexOf(action) > -1;
				});
				let pCount = permissions.length;

				// if no permissions found, then reject it with error message
				if(pCount < 1) reject(new Error('Unauthorized Access!!'));

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
				let fn;
				let data;
				let evaluatedPerms = permissionsWithCondition.filter(perm => { 	// filter for permission that 
					fn = new Function("data", perm.condition);					// evaluates its condition to true
					data = { userId: userId, ownerId: model.owner };
					return fn(data);
				});
				evaluatedPerms.length > 0 
					? resolve(model) // if at least one condition is evaluated to true, pass the model for futher processing
					: reject(new Error('Unauthorized Access!!!')); // all conditions evaluated to false, return error with message
			})
			.catch(err => reject(err));
	});
	
} 


/*
function allows(userId, resource, ownerId, action) {
	console.log('authorization process...');
	getUserPermissions(userId, resource)
		.then(models => {
			let permissions = models.filter(perm => {
				return perm.operations.indexOf(action) > -1;
			});
			let pCount = permissions.length;
			if(pCount < 1) return false;

			let permissionsWithCondition = permissions.filter(perm => {
				return perm.condition != null && perm.condition != '';
			});
			let pwcCount = permissionsWithCondition.length;
			if(pwcCount < 1) return true;

			if(pCount > pwcCount) return true; 

			// evaluate condition in each of the permissionsWithCondition
			let fn;
			let data;
			let evaluatedPerms = permissionsWithCondition.filter(perm => {
				fn = new Function("data", perm.condition);
				data = { userId: userId, ownerId: ownerId };
				return fn(data);
			});
			return evaluatedPerms.length > 0;
		})
		.catch(err => reject(err));	
} */