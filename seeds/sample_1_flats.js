//  [ flat_number1, flat_number2, ...]
let sampleData = [
  ['NW', 'G1', 1, 1], ['NW', 'G2', 1, 0],
  ['NE', 'G3', 1, 0], ['NE', 'G4', 2, 1],
  ['SE', 'G5', 1, 0], ['SE', 'G6', 1, 1],
  ['SW', 'G7', 1, 1], ['SW', 'G8', 1, 1],
  ['NW', 'F1', 1, 1], ['NW', 'F2', 1, 1],
  ['NE', 'F3', 1, 1], ['NE', 'F4', 2, 0],
  ['SE', 'F5', 1, 1], ['SE', 'F6', 1, 0],
  ['SW', 'F7', 2, 0], ['SW', 'F8', 1, 1]
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
      block_number: data[0],
      flat_number: data[1],
      max_owners: data[2],
      max_tenants: data[3]
    };
  }

};
