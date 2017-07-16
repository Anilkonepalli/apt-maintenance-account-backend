class AccountUtility {
  constructor(data) {
    this.data = data;
  }
  // public functions to use it in condition column of Permission table
  accountsBelongOnlyToFlatOf(loggedUserId) {
    console.log('inside accountsBelongsToFlatOf()...');
    return belongsTo(loggedUserId, this.data);
  }


  // private functions
  belongsTo(loggedUserId, models){
    let flats=[];
    let residents;
    return identifyResidentsOf(loggerUserId)
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
        let result = models.filter(eachModel => flatNumbers.includes(eachModel.flat_number));
        return result;
      }
      function handleError(err){
        console.log(err);
      }
  }

}


module.exports = AccountUtility;
