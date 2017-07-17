//var dynamicFunction;

class Parser {
  static getFunction(condition) {
    let statement = 'return this.'+condition+'();';
    return new Function(statement);
  }
}

class Utility {

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
