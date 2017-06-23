// [ firstName, lastName, isA ]
let sampleData = [
  ['og1', '', 'owner'], // Owner of flat# g1 is shortly written as og1
  ['og2', '', 'owner'],
  ['og3', '', 'owner'],
  ['og4', '', 'owner'],
  ['og5', '', 'owner'],
  ['og6', '', 'owner'],
  ['og7', '', 'owner'],
  ['og8', '', 'owner'],
  ['of1', '', 'owner'],
  ['of2', '', 'owner'],
  ['of3', '', 'owner'],
  ['of4', '', 'owner'],
  ['of5', '', 'owner'],
  ['of6', '', 'owner'],
  ['of7', '', 'owner'],
  ['of8', '', 'owner'],
  ['tg1', '', 'tenant'], // Tenant, if any, of flat# tg1 is shortly written as tg1
  ['tg2', '', 'tenant'],
  ['tg3', '', 'tenant'],
  ['tg4', '', 'tenant'],
  ['tg5', '', 'tenant'],
  ['tg6', '', 'tenant'],
  ['tg7', '', 'tenant'],
  ['tg8', '', 'tenant'],
  ['tf1', '', 'tenant'],
  ['tf2', '', 'tenant'],
  ['tf3', '', 'tenant'],
  ['tf4', '', 'tenant'],
  ['tf5', '', 'tenant'],
  ['tf6', '', 'tenant'],
  ['tf7', '', 'tenant'],
  ['tf8', '', 'tenant']
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
