
let sampleData = [
  {
    roleName: 'guest',
    users: [ 'guest@eastgate.in',  'manager@eastgate.in' ]
  },
  {
    roleName: 'member-t',
    users: [
      'tg1@eastgate.in',  'tg2@eastgate.in',  'tg3@eastgate.in',  'tg4@eastgate.in',
      'tg5@eastgate.in',  'tg6@eastgate.in',  'tg7@eastgate.in',  'tg8@eastgate.in',
      'tf1@eastgate.in',  'tf2@eastgate.in',  'tf3@eastgate.in',  'tf4@eastgate.in',
      'tf5@eastgate.in',  'tf6@eastgate.in',  'tf7@eastgate.in',  'tf8@eastgate.in'
    ]
  },
  {
    roleName: 'supervisor',
    users: [ 'su@eastgate.in',  'manager@eastgate.in' ]
  },
  {
    roleName: 'manager',
    users: [ 'manager@eastgate.in'  ]
  },
  {
    roleName: 'admin',
    users: [ 'admin@eastgate.in'  ]
  },
  {
    roleName: 'member-o',
    users: [
      'og1@eastgate.in',  'og2@eastgate.in',  'og3@eastgate.in',  'og4@eastgate.in',
      'og5@eastgate.in',  'og6@eastgate.in',  'og7@eastgate.in',  'og8@eastgate.in',
      'of1@eastgate.in',  'of2@eastgate.in',  'of3@eastgate.in',  'of4@eastgate.in',
      'of5@eastgate.in',  'of6@eastgate.in',  'of7@eastgate.in',  'of8@eastgate.in'
    ]
  }
];

let tableName = 'roles_users';
let sourceTable1 = 'roles';
let sourceTable2 = 'users';
let roles;
let users;

exports.seed = function(knex, Promise) {

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(getRoles) // get all rows of Roles table
    .then(getUsers) // get all rows of users tables
    .then(addSamples);

  function getRoles() {
    return knex.select('id', 'name').from(sourceTable1);
  }
  function getUsers(rows) {
    roles = rows;
    // console.log('Roles: '); console.log(rows);
    return knex.select('id', 'email').from(sourceTable2);
  }
  function addSamples(rows){
    users = rows;
    // console.log('users: '); console.log(rows);
    let links = [];
    let link;
    let rid;
    let uid;
    sampleData.forEach(obj => {
      rid = getRoleIdFor(obj.roleName);
      // console.log('Role id: '); console.log(rid);
      if(rid) {
        obj.emails.forEach(eachEmailId => {
          uid = getUserIdFor(eachEmailId);
          // console.log('user id: '); console.log(uid);
          if(uid) {
            link = knex(tableName).insert({role_id: rid, user_id: uid});
            links.push( link );
          }
        });
      }
    });
    return Promise.all(links);
  }

  function getRoleIdFor(roleName){
    let fRoles = roles.filter(each => each.name === roleName);
    // console.log('Role..'); console.log(fRoles);
    if(fRoles.length < 1) {
      return null
    }
    return fRoles[0].id;
  }
  function getUserIdFor(email) {
    let fusers = users.filter(each => each.email === email);
    // console.log('Role..'); console.log(fRoles);
    if(fusers.length < 1) {
      return null
    }
    return fusers[0].id;
  }

}
