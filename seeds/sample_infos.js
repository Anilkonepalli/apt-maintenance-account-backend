// ['email-id', `key`, `value`]

let sampleData =[
  ['guest@eastgate.in', 'cell', '1234567890'],
  ['guest@eastgate.in', 'cell', '2345678901'],
  ['guest@eastgate.in', 'email', 'a@a.a'],
  ['guest@eastgate.in', '4wheeler', 'TN 11 AZ 7899'],
  ['guest@eastgate.in', '2wheeler', 'TN 22 DX 8686'],
  ['admin@eastgate.in', 'cell', '9876543210'],
  ['admin@eastgate.in', 'email', 'z@z.z'],
  ['admin@eastgate.in', '2wheeler', 'TN 01 AA 2129'],
];
let tableName = 'infos';
let parentTable = 'users';
let users;

exports.seed = function(knex, Promise) {

  return knex(tableName)
    .del() // Deletes ALL existing entries
    .then(getUsers)
    .then(addSamples);

  function addSamples(users) {
      this.users = users;
      let sampleRecords = [];
      sampleData.forEach((each) => {
        sampleRecords.push( knex(tableName).insert( recordOn(each) ) );
      });
      return Promise.all(sampleRecords);
  }
  function getUsers() {
    return knex.select('id', 'email').from(parentTable);
  }
  function recordOn(data) {
    let user = this.users.filter(each => each.email === data[0]);
    return {
      user_id: user[0].id,
      key: data[1],
      value: data[2]
    };
  }

};
