// [ {Role:'name`, permissions: [ [ Operations, Resource, Condition_NotNullOrEmpty ]...  ]}
//   { Role:'name', permissions: [ [] ] }, ...
// ]
// guest 1  => 1, 16, 17, 18, 19, 21, 23, 25, 27

let sampleData = [{
  role: 'guest',
  permissions: [
                  ['R', 'accounts', null],
                  ['R', 'users', null],
                  ['R', 'flats', null],
                  ['R', 'residents', null],
                  ['R', 'roles', null],
                  ['R', 'Permissions', null],
                  ['R', 'flats-residents', null],
                  ['R', 'users-roles', null],
                  ['R', 'roles-permissions', null]
                ]
  }
]
  /*
  'member-t', [

              ],
  'supervisor'
  'manager'
  'admin'
  'member-o'
]; */
let tableName = 'permissions_roles';
let allIds = [];
let roleId;
let permissionIds = [];

exports.seed = function(knex, Promise) {
  let roleIds = [];
  let permissionIds = [];
  return knex(tableName)
    .del() // Deletes ALL existing entries
//    .then(getRoleIds)
//    .then(getPermissionIds)
    .then(ids)
    .then(addSamples);

  function ids() {
    let idObj;
    let links = [];
    sampleData.forEach( eachObj => {
      idObj  = { roleId: 0, permissionIds: [] };
      idObj.roleId = knex('roles')
        .where('name', eachObj.role)
        .select('id');
      eachObj.permissions.forEach(eachPerm => {
        if(eachPerm[2]) { // if not null
          idObj.permissionIds.push( knex('permissions')
            .where('operations', eachPerm[0])
            .andWhere('resource', eachPerm[1])
            .whereNotNull('condition')
            .select('id'));
        } else { // if null
          idObj.permissionIds.push( knex('permissions')
            .where('operations', eachPerm[0])
            .andWhere('resource', eachPerm[1])
            .whereNull('condition')
            .select('id'));
        }
      });
      links.push( new Promise( resolve => resolve(idObj) ) );
    });
    return Promise.all(links);
  }

/*
  function getRoleIds() {
    sampleData.forEach((eachObj) => {
      roleIds.push( knex('roles').where('name', eachObj.role).select('id') );
    });
    return Promise.all(roleIds);
  }
  function getPermissionIds(ids){
    roleIds = ids.map(each => each[0].id);
    console.log('Role Ids: '); console.log(roleIds);
    let temp;
    sampleData.forEach((eachObj) => {
      temp = [];
      eachObj.permissions.forEach((eachPerm) => {
        let stmt;
        if(eachPerm[2]) {
          stmt = knex('permissions')
                  .where('operations', eachPerm[0])
                  .andWhere('resource', eachPerm[1])
                  .whereNotNull('condition')
                  .select('id');
        } else {
          stmt = knex('permissions')
                  .where('operations', eachPerm[0])
                  .andWhere('resource', eachPerm[1])
                  .whereNull('condition')
                  .select('id');
        }
        temp.push( stmt );
      });
      permissionIds.push( temp );
    });
    return Promise.all(permissionIds);
  }
*/

  function addSamples(ids) {
      //permissionIds = ids.map(each => each[0]);
      //console.log('perms ids:'); console.log(permissionIds);
      console.log('Ids: '); console.log(ids);
      let sampleRecords = [];
      sampleData.forEach((each) => {
        console.log('Role ID: '); console.log(each.roleId);
        console.log('Permissions: '); console.log(each.permissionIds);
        //sampleRecords.push( knex(tableName).insert( recordOn(each) ) );
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
