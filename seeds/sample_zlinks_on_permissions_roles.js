
let sampleData = [
  {
    roleName: 'guest',
    permissions: [
      ['R', 'accounts', null],
      ['R', 'users', null],
      ['R', 'flats', null],
      ['R', 'residents', null],
      ['R', 'roles', null],
      ['R', 'permissions', null],
      ['R', 'flats-residents', null],
      ['R', 'users-roles', null],
      ['R', 'roles-permissions', null]
    ]
  },
  {
    roleName: 'member-t',
    permissions: [
      ['R', 'accounts', 'hasCondition'],
      ['R', 'flats', null],
      ['R', 'residents', null],
      ['RU', 'user-profile', 'hasCondition']
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
    console.log('Roles: '); console.log(rows);
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
      console.log('Role id: '); console.log(rid);
      obj.permissions.forEach(eachPerm => {
        pid = getPermIdFor(eachPerm);
        console.log('permission id: '); console.log(pid);
        link = knex(tableName).insert({role_id: rid, permission_id: pid});
        links.push( link );
      });
    });
    return Promise.all(links);
  }

  function getRoleIdFor(roleName){
    let role = roles.filter(each => each.name == roleName);
    // console.log('Role..'); console.log(role);
    return role[0].id;
  }
  function getPermIdFor(arr) {
    return arr[2]
      ? getPermsIdWithCondition(arr)
      : getPermsIdNullCondition(arr);
  }
  function getPermsIdNullCondition(arr){
    // console.log('Array: '); console.log(arr);
    let perm = perms.filter(each =>
      each.operations === arr[0]
    && each.resource === arr[1]
    && each.condition === null);
    // console.log('Permission w/o condition: '); console.log(perm);
    return perm[0].id;
  }
  function getPermsIdWithCondition(arr){
    let perm = perms.filter(each =>
      each.operations === arr[0]
    && each.resource === arr[1]
    && each.condition !== null);
    // console.log('Permission w/ condition: '); console.log(perm);
    return perm[0].id;
  }
}
