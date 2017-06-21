// [`name`, `description`, `inherits`]

let sampleData =[
  ['guest', 'A role to view records such as accounts', null],
  ['member-t', 'Role can update own record, such as USER PROFILE', null],
  ['supervisor', 'A role to add/edit records such as accounts', null],
  ['manager', 'A role to delete records such as accounts', 'supervisor'],
  ['admin', 'A role to add/edit/delete records such as Roles, Permissions, Users', null],
  ['member-o', 'Inherits member-t role; plus it has few read-only permissions on few modules', 'member-t']
];
let tableName = 'roles';

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
