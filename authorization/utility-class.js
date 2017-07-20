var	Bookshelf 					= require('../config/database');
var	Resident            = require('../residents/model');

class Parser {
  static getFunction(condition) {
    let statement = 'return this.'+condition+'(data);';
    return new Function("data", statement);
  }
}

class Utility {

  static getAdditionalData(conditions, userId) {
    let promise;
		let promises = [];
		conditions.forEach(condition => {
			switch(condition) {
				case 'userOwnAccounts':
					promise = Resident
                      .where({owner_id: userId})
                      .fetch({withRelated:['flats']});
					break;
				default:
					promise = Promise.resolve(false);
			}
			promises.push(promise);
		});
		return Promise.all(promises);
  }

  static attachAdditionalData(conditions, additionalData, data){
    for(let i=0; i<conditions.length; i++){
			switch(conditions[i]){
				case 'userOwnAccounts':
					data['resident'] = additionalData[i].toJSON();
					break;
				default:
					"do nothing here"
			}
		}
  }

  constructor(condition) {
    this.dynamicFunction = Parser.getFunction(condition);
  }

  evaluate(data) {
    return this.dynamicFunction(data);
  }

  userOwnAccounts(data) {
    logger.log('debug', 'inside userOwnAccounts()...');
    logger.log('debug', data.resident);
    let today = new Date();
    let occupiedDate = today;
    let vacatedDate = today;
    if(data.resident.occupied_on)
      occupiedDate = new Date(data.resident.occupied_on);
    if(data.resident.vacated_on)
      vacatedDate = new Date(data.resident.vacated_on);
    if(today < occupiedDate || today > vacatedDate) {
      logger.log('debug', 'Not Residing at present');
      return false; // not residing and hence no accounts to view
    }
    let flatNumbers = data.resident.flats.map(each => each.flat_number);
    return flatNumbers.includes(data.model.flat_number);
  }

  userOwnRecord() {
    return this.data.user_id === this.data.model.owner_id;
  }
}

module.exports = Utility;
