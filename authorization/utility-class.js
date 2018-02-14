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
    logger.debug('inside userOwnAccounts()...');
    logger.debug(data.resident);
    let today = new Date();
    let occupiedDate = new Date('1999-01-01');
    let vacatedDate = new Date('2999-12-31');
    if(data.resident.occupied_on)
      occupiedDate = new Date(data.resident.occupied_on);
    if(data.resident.vacated_on)
      vacatedDate = new Date(data.resident.vacated_on);
    if(today < occupiedDate || today > vacatedDate) {
      logger.debug('Not Residing at present');
      return false; // not residing and hence no accounts to view
    }
    let flatNumbers = data.resident.flats.map(each => each.flat_number);
    return flatNumbers.includes(data.model.flat_number);
  }

  userOwnRecord(data) {
    logger.debug('inside Utility class >> userOwnRecord()...');
    logger.debug('data is: '); logger.log(data);
    return data.user_id === data.model.owner_id;
  }
}

module.exports = Utility;
