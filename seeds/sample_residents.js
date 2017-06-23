// [ firstName, lastName, isA ]
let sampleData = [
  ['og1', 'user', 'owner'], // Owner of flat# g1 is shortly written as og1
  ['og2', 'user', 'owner'],
  ['og3', 'user', 'owner'],
  ['og4', 'user', 'owner'],
  ['og5', 'user', 'owner'],
  ['og6', 'user', 'owner'],
  ['og7', 'user', 'owner'],
  ['og8', 'user', 'owner'],
  ['of1', 'user', 'owner'],
  ['of2', 'user', 'owner'],
  ['of3', 'user', 'owner'],
  ['of4', 'user', 'owner'],
  ['of5', 'user', 'owner'],
  ['of6', 'user', 'owner'],
  ['of7', 'user', 'owner'],
  ['of8', 'user', 'owner'],
  ['tg1', 'user', 'tenant'], // Tenant, if any, of flat# tg1 is shortly written as tg1
  ['tg2', 'user', 'tenant'],
  ['tg3', 'user', 'tenant'],
  ['tg4', 'user', 'tenant'],
  ['tg5', 'user', 'tenant'],
  ['tg6', 'user', 'tenant'],
  ['tg7', 'user', 'tenant'],
  ['tg8', 'user', 'tenant'],
  ['tf1', 'user', 'tenant'],
  ['tf2', 'user', 'tenant'],
  ['tf3', 'user', 'tenant'],
  ['tf4', 'user', 'tenant'],
  ['tf5', 'user', 'tenant'],
  ['tf6', 'user', 'tenant'],
  ['tf7', 'user', 'tenant'],
  ['tf8', 'user', 'tenant']
];
let tableName = "residents";

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
      first_name: data[0],
      last_name: data[1],
      is_a: data[2]
    };
  }

};
