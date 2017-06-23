// [ operations, resource, condition, description]
let sampleData = [
  ['R', 'accounts', null, 'Grants READ ONLY permissions to ANY USERS'],
  ['RUD', 'users', 'return data.user_id === data.model.owner_id', 'Grants RUD PERMISSIONS to user\'s OWN RECORDS'],
  ['CRUD', 'accounts', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['R', 'accounts', 'return data.user_id == data.model.owner_id', 'Grants READ ONLY permissions to USER SPECIFIC record'],
  ['CRUD', 'roles', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['CRUD', 'flats', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['CRUD', 'residents', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['CRUD', 'users', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['R', 'users', null, 'Grants READ ONLY permission to ANY USERS'],
  ['R', 'flats', null, 'Grants READ ONLY permission to ANY USERS'],
  ['R', 'residents', null, 'Grants READ ONLY permission to ANY USER'],
  ['R', 'roles', null, 'Grants READ ONLY permission to ANY USERS'],
  ['CRUD', 'permissions', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['R', 'permissions', null, 'Grants READ ONLY permission to ANY USERS'],
  ['RU', 'flats-residents', null, 'Grants READ and UPDATE permissions to ANY USERS'],
  ['R', 'flats-residents', null, 'Grants READ ONLY permission to ANY USERS'],
  ['RU', 'users-roles', null, 'Grants READ and UPDATE permissions to ANY USERS'],
  ['R', 'users-roles', null, 'Grants READ ONLY permission to ANY USERS'],
  ['RU', 'roles-permissions', null, 'Grants READ and UPDATE permissions to ANY USERS'],
  ['R', 'roles-permissions', null, 'Grants READ ONLY permission to ANY USERS'],
  ['D', 'accounts', null, 'Grants DELETE permission to ANY USERS'],
  ['CRU', 'accounts', null, 'Grants ALL but Delete permissions to ANY USERS'],
  ['R', 'accounts', 'return params.user_id === params.model.owner_id', 'Grants READ ONLY permissions to USER SPECIFIC record'],
  ['RU', 'user-profile', 'return data.user_id === data.model.owner_id', 'Grants RU permissions to USER\'s OWN RECORD']
];
let tableName = "permissions";

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
      operations: data[0],
      resource: data[1],
      condition: data[2],
      description: data[3]
    };
  }

};
