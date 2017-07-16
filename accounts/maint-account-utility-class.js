class AccountUtility {
  constructor(data) {
    this.data = data;
  }
  // public functions to use it in condition column of Permission table
  accountsOf(loggedUserId) {
    let flats=[];
    let residents;
    let models = this.data;
    console.log('inside accountsOf()...');
    let result = identifyResidentsOf(loggerUserId)
                  .then(identifyFlats)
                  .catch(handleError);
    // inner functions
    function identifyResidentsOf(userId) {
      console.log('inside identifyResidentsOf()...');
      return knex('residents').where('owner_id', '=', userId);
    }
    function identifyFlats(prevResult){
      console.log('inside identifyFlats()...');
      residents = prevResult;
      residents.forEach(eachResident => {
        flats.push( eachResident.flats );
      });
      let flatNumbers = flats.map(each => each.flat_number);
      let fmodels = models.filter(eachModel => flatNumbers.includes(eachModel.flat_number));
      return fmodels;
    }
    function handleError(err){
      console.log(err);
    }
  }

}


module.exports = AccountUtility;
