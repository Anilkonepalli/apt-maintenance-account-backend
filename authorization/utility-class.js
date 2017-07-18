var	Bookshelf 					= require('../config/database');
//var knex								= Bookshelf.knex;
var	Resident            = require('../residents/model');
/* var Residents = Bookshelf.Collection.extend({
	model: Resident
}); */

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
					//promise = knex('residents').where('owner_id', '=', userId);
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
    // console.log('inside evaluate()...');
    // console.log(data);
    return this.dynamicFunction(data);
  }

  userOwnAccounts(data) {
    // console.log('inside userOwnAccounts()...');
    //console.log(data.resident.flats);
    //return true;
    let flatNumbers = data.resident.flats.map(each => each.flat_number);
    return flatNumbers.includes(data.model.flat_number);
  }

  userOwnRecord() {
    return this.data.user_id === this.data.model.owner_id;
  }
}

module.exports = Utility;
