// ['email-id', `key`, `value`]

let sampleData =[
  ['guest@eastgate.in', 'cellNumbers', '1234567890,2345678901'],
  ['guest@eastgate.in', 'residentType', 'Not Applicable'],
  ['guest@eastgate.in', 'flatNumber', 'NA'],
  ['guest@eastgate.in', 'otherEmails', 'a@a.a, b@b.b'],
  ['guest@eastgate.in', 'fourWheelers', 'TN 11 AZ 7899'],
  ['guest@eastgate.in', 'twoWheelers', 'TN 22 DX 8686'],
  ['guest@eastgate.in', 'emergencyContacts', 'none'],
  ['admin@eastgate.in', 'cellNumbers', '2468024680,1357913579'],
  ['admin@eastgate.in', 'residentType', 'Not Applicable'],
  ['admin@eastgate.in', 'flatNumber', 'NA'],
  ['admin@eastgate.in', 'otherEmails', 'y@y.y, z@z.z'],
  ['admin@eastgate.in', 'fourWheelers', 'TN 22 Y 1234'],
  ['admin@eastgate.in', 'twoWheelers', 'TN 01 AC 9876'],
  ['admin@eastgate.in', 'emergencyContacts', 'administrator, eastgate'],
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
