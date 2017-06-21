//  [ flat_number1, flat_number2, ...]
let sampleData = [
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'
];
let tableName = 'flats';

exports.seed = function(knex, Promise) {

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(addSamples);

  function addSamples() {
      let sampleRecords = [];
      sampleData.forEach((each) => {
        sampleRecords.push( knex(tableName).insert( recordOn(each) ) );
      });
      return Promise.all(sampleRecords);
  }

  function recordOn(data) {
    return {
      flat_number: data
    };
  }

};
