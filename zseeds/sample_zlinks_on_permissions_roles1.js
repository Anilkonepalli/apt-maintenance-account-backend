// [ [Role:'name`, perm_Operations, perm_Resource, perm_Condition_NotNullOrEmpty ]...  ]
// guest 1  => 1, 16, 17, 18, 19, 21, 23, 25, 27

let sampleData = [
  ['guest', 'R', 'accounts', null],
  ['guest', 'R', 'users', null],
  ['guest', 'R', 'flats', null],
  ['guest', 'R', 'residents', null],
  ['guest', 'R', 'roles', null],
  ['guest', 'R', 'Permissions', null],
  ['guest', 'R', 'flats-residents', null],
  ['guest', 'R', 'users-roles', null],
  ['guest', 'R', 'roles-permissions', null]
];

let tableName = 'permissions_roles';
let allIds = [];
let roleId;
let permissionIds = [];

exports.seed = function(knex, Promise) {
  let indx;
  let roleId;
  let permId;

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(addSamples);

  function addSamples() {
    console.log('Add samples...');
    let links = [];
    let link;
    for(i=0; i<sampleData.size; i++) {
      indx = i;
      link =  getRoleId()
                .then(getPermissionId)
                .then(createLink);
      links.push(link);
    }
    return Promise.all(links);
  }

  function getRoleId() {
    console.log('get role id...');
    return knex('roles')
      .where('name', sampleData[indx][0])
      .select('id');
  }
  function getPermissionId(id){
    console.log('Role Id: '+id);
    roleId = id;
    if(sampleData[indx][3]) { // if not null
      return knex('permissions')
        .where('operations', sampleData[indx][1])
        .andWhere('resource', sampleData[indx][2])
        .whereNotNull('condition')
        .select('id');
    } else { // if null
      return knex('permissions')
        .where('operations', sampleData[indx][1])
        .andWhere('resource', sampleData[indx][2])
        .whereNull('condition')
        .select('id');
    }
  }
  function createLink(id) {
    console.log('Permission id: '+id);
    permId = id;
    return knex(tableName)
            .insert({ role_id: roleId, permission_id: permId });
  }

}
