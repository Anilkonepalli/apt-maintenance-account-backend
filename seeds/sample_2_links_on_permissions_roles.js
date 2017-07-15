
let sampleData = [
  {
    roleName: 'guest',
    permissions: [
      ['R', 'accounts', null], // read-only permission on 'accounts' module
      ['R', 'users', null],
      ['R', 'flats', null],
      ['R', 'residents', null],
      ['R', 'roles', null],
      ['R', 'permissions', null],
      ['R', 'flats-residents', null],
      ['R', 'users-roles', null],
      ['R', 'roles-permissions', null],
      ['R', 'account-summary', null]
    ]
  },
  {
    roleName: 'member-t',
    permissions: [
      ['R', 'accounts', 'hasCondition'],
      ['R', 'flats', null],
      ['R', 'residents', null],
      ['RU', 'user-profile', 'hasCondition'] // Read and Update permissions on 'user-profile' module
    ]
  },
  {
    roleName: 'member-o',
    permissions: [
      ['R', 'account-summary', null]
    ]
  },
  {
    roleName: 'supervisor',
    permissions: [
      ['CRU', 'accounts', null], // Create, Read, Update permissions on 'accounts' module
      ['RU', 'user-profile', 'hasCondition'],
      ['R', 'account-summary', null]
    ]
  },
  {
    roleName: 'manager',
    permissions: [
      ['D', 'accounts', null] // Delete permission on 'accounts' module
    ]
  },
  {
    roleName: 'admin',
    permissions: [
      ['CRUD', 'accounts', null],
      ['CRUD', 'roles', null],
      ['CRUD', 'flats', null],
      ['CRUD', 'residents', null],
      ['CRUD', 'users', null],
      ['CRUD', 'permissions', null],
      ['RU', 'flats-residents', null],
      ['RU', 'users-roles', null],
      ['RU', 'roles-permissions', null],
      ['RU', 'user-profile', 'hasCondition'],
      ['R', 'account-summary', null]
    ]
  }

];

let tableName = 'permissions_roles';
let sourceTable1 = 'roles';
let sourceTable2 = 'permissions';
let roles;
let perms;

exports.seed = function(knex, Promise) {

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(getRoles) // get all rows of Roles table
    .then(getPermissions) // get all rows of Permissions tables
    .then(addSamples);

  function getRoles() {
    return knex.select('id', 'name').from(sourceTable1);
  }
  function getPermissions(rows) {
    roles = rows;
    // console.log('Roles: '); console.log(rows);
    return knex.select('id', 'operations', 'resource', 'condition').from(sourceTable2);
  }
  function addSamples(rows){
    perms = rows;
    // console.log('Permissions: '); console.log(rows);
    let links = [];
    let link;
    let rid;
    let pid;
    sampleData.forEach(obj => {
      rid = getRoleIdFor(obj.roleName);
      // console.log('Role id: '); console.log(rid);
      obj.permissions.forEach(eachPerm => {
        pid = getPermIdFor(eachPerm);
        // console.log('permission id: '); console.log(pid);
        link = knex(tableName).insert({role_id: rid, permission_id: pid});
        links.push( link );
      });
    });
    return Promise.all(links);
  }

  function getRoleIdFor(roleName){
    let fRoles = roles.filter(each => each.name == roleName);
    // console.log('Role..'); console.log(fRoles);
    return fRoles[0].id;
  }
  function getPermIdFor(arr) {
    return arr[2]
      ? getPermsIdWithCondition(arr)
      : getPermsIdNullCondition(arr);
  }
  function getPermsIdNullCondition(arr){
    // console.log('Array: '); console.log(arr);
    let fPerms = perms.filter(each =>
      each.operations === arr[0]
    && each.resource === arr[1]
    && each.condition === null);
    // console.log('Permission w/o condition: '); console.log(fPerms);
    return fPerms[0].id;
  }
  function getPermsIdWithCondition(arr){
    let fPerms = perms.filter(each =>
      each.operations === arr[0]
    && each.resource === arr[1]
    && each.condition !== null);
    // console.log('Permission w/ condition: '); console.log(fPerms);
    return fPerms[0].id;
  }
}
