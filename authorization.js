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
		return new Promise( function(resolve, reject) {
			allows(userId, resource, model.owner, 'U'); // U stands for Update/Edit 
			1 == 0 ? resolve(model) : reject(new Error('Unauthorized Access!!'));
		});
	}

}

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
}