//var dynamicFunction;

class Parser {
  static getFunction(condition) {
    let statement = 'return this.'+condition+'();';
    return new Function(statement);
  }
}

class Utility {

  static dependantAPIs() {
    return [
      'userOwnAccounts'
    ];
  }

  static hasDependencies(conditions){
    let dependants = conditions.filter(each => this.dependantAPIs.includes(each));
    return dependants.length > 0;
  }

  constructor(condition, data) {
    this.dynamicFunction = Parser.getFunction(condition);
  }

  evaluate() {
    console.log('inside evaluate()...');
    return this.dynamicFunction();
  }

  userOwnAccounts() {
    console.log('inside userOwnAccounts()...');
    return true;
  }

  userOwnRecord() {
    return this.data.user_id === this.data.model.owner_id;
  }
}

module.exports = Utility;
