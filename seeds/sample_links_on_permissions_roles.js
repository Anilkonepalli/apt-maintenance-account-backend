// [ Role:'name`, [ Permissions:[ Operations, Resource, Condition_NotNullOrEmpty ]  ]

let sampleData =[
  'guest'
  'member-t'
  'supervisor'
  'manager'
  'admin'
  'member-o'
];
let tableName = 'permissions_roles';

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
      name: data[0],
      description: data[1],
      inherits: data[2]
    };
  }

};
