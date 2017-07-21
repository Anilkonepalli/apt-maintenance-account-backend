// [ item, flat_number, for_month, for_year, name, crdr, amount, category, recorded_at, remarks ]
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1; // month is from 0 to 11 hence +1 is added

let year1 = year2 = year3 = year;
let month1 = month - 1;
let month2 = month;
let month3 = month+1;
if(month1 < 1) { month1 = 12; year1--;}
if(month3 > 12){ month3 = 1; year3++;}


let sampleData = [
  ['test item1', 'G1', month1, year1, 'tester1', 'cr', 600.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item2', 'G2', month1, year1, 'tester2', 'dr', 100.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item3', 'G3', month1, year1, 'tester3', 'cr', 600.00, 'Monthly maintenance', today, 'testing maint app']

  ['test item4', 'G1', month2, year2, 'tester4', 'dr', 200.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item5', 'G2', month2, year2, 'tester5', 'cr', 900.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item6', 'G3', month2, year2, 'tester6', 'dr', 200.00, 'Monthly maintenance', today, 'testing maint app']

  ['test item7', 'G1', month3, year3, 'tester7', 'cr', 300.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item8', 'G2', month3, year3, 'tester8', 'dr', 300.00, 'Monthly maintenance', today, 'testing maint app'],
  ['test item9', 'G3', month3, year3, 'tester9', 'cr', 300.00, 'Monthly maintenance', today, 'testing maint app']

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
      recorded_at: data[8],
      remarks: data[9]
    };
  }

};
