// [ item, flat_number, for_month, for_year, name, crdr, amount, category, recorded_at, remarks ]
let sampleData = [
  ['test item1', '01', 12, 2016, 'tester1', 'cr', 600.00, 'Monthly maintenance', '2016-12-08T00:00:00', 'testing maint app'],
  ['test item2', '02', 01, 2017, 'tester2', 'dr', 100.00, 'Monthly maintenance', '2016-12-08T00:00:00', 'testing maint app'],
  ['test item3', '03', 03, 2017, 'tester3', 'cr', 600.00, 'Monthly maintenance', '2016-12-08T00:00:00', 'testing maint app']
];
let tableName = "maintenance_accounts";

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
      item: data[0],
      flat_number: data[1],
      for_month: data[2],
      for_year: data[3],
      name: data[4],
      crdr: data[5],
      amount: data[6],
      category: data[7],
      remarks: data[8]
    };
  }

};
