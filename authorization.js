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
					myAddPerm !== undefined ? resolve(true) : reject('Unauthorized Access');
				})
				.catch(err => reject(err));
		});
	}

}