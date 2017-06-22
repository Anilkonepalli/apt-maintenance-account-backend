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

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(getIds)
    .then(addSamples);

  function getIds() {
    let tempRecords = [];
    let temp = {
      roleId: 0,
      permissionIds: []
    };
    sampleData.forEach((eachObj) => {
      temp.roleId = knex('roles').where('name', eachObj.role).select('id');
      eachObj.permissions.forEach((eachPerm) => {
        temp.permissionIds.push( knex('permissions')
                                  .where('operations', eachPerm[0])
                                  .andWhere('resources', eachPerm[1])
                                  .andWhere('condition', eachPerm[2]==null ? '==' : '!==', null)
                                  .select('id')
                                );
      });
      tempRecords.push(temp);
    });
    return Promise.all(tempRecords);
  }

  function addSamples(ids) {
      console.log('ids:'); console.log(ids);
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
