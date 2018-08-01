// [ operations, resource, condition, description]
let sampleData = [
  ['R', 'accounts', null, 'Grants READ ONLY permissions to ANY USERS'],
  ['R', 'my-accounts', null, 'Grants READ ONLY permissions to ANY USERS'],
  ['RUD', 'users', 'userOwnRecord', 'Grants RUD PERMISSIONS to user\'s OWN RECORDS'],
  ['CRUD', 'accounts', null, 'Grants ALL PERMISSIONS to ANY USERS'],
  ['R', 'accounts', 'userOwnAccounts', 'Grants READ ONLY permissions to USER SPECIFIC record'],
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
  ['RU', 'user-profile', 'userOwnRecord', 'Grants RU permissions to USER\'s OWN RECORD'],
  ['R', 'account-summary', null, 'Grands READ ONLY permission to ANY USERS'],
  ['R', 'balance', null, 'Grands READ ONLY permission to ANY USERS'],
  ['CRUD', 'durations', null, 'Grants ALL Permissions to ANY USERS'],
  ['CRU', 'durations', null, 'Grants CRU permissions to ANY USERS'],
  ['R', 'durations', null, 'Grants READ ONLY permission to ANY USERS']
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
