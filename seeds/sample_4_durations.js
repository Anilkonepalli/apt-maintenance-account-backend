// [`key`, `value`, 'effective_from', 'effective_to', 'remarks']

let sampleData =[
  ['monthly-maintenance-fee', '300', '2010-08-01', '2015-12-31', 'flat maintenance fee'],
  ['monthly-maintenance-fee', '600', '2016-01-01', '2050-12-31', 'revised fee on Saturday 2015-12-15'],
];
let tableName = 'durations';

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
      key: data[0],
      value: data[1],
      effective_from: data[2],
      effective_to: data[3],
      remarks: data[4]
    };
  }

};
