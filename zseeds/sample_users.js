// [ `name`, `first_name`, `last_name`, `email`, `password`, `confirmed`]

let sampleData = [
  ['guestuser', 'guest', 'user', 'guest@eastgate.in', 'password123', 1],
  ['superuser', 'super', 'user', 'su@eastgate.in', 'password123', 1],
  ['manageuser', 'manage', 'user', 'manager@eastgate.in', 'password123', 1],
  ['adminuser', 'admin', 'user', 'admin@eastgate.in', 'password123', 1],
  ['og1', 'og1', 'user', 'og1@eastgate.in', 'password123', 1],
  ['og2', 'og2', 'user', 'og2@eastgate.in', 'password123', 1],
  ['og3', 'og3', 'user', 'og3@eastgate.in', 'password123', 1],
  ['og4', 'og4', 'user', 'og4@eastgate.in', 'password123', 1],
  ['og5', 'og5', 'user', 'og5@eastgate.in', 'password123', 1],
  ['og6', 'og6', 'user', 'og6@eastgate.in', 'password123', 1],
  ['og7', 'og7', 'user', 'og7@eastgate.in', 'password123', 1],
  ['og8', 'og8', 'user', 'og8@eastgate.in', 'password123', 1],
  ['of1', 'of1', 'user', 'of1@eastgate.in', 'password123', 1],
  ['of2', 'of2', 'user', 'of2@eastgate.in', 'password123', 1],
  ['of3', 'of3', 'user', 'of3@eastgate.in', 'password123', 1],
  ['of4', 'of4', 'user', 'of4@eastgate.in', 'password123', 1],
  ['of5', 'of5', 'user', 'of5@eastgate.in', 'password123', 1],
  ['of6', 'of6', 'user', 'of6@eastgate.in', 'password123', 1],
  ['of7', 'of7', 'user', 'of7@eastgate.in', 'password123', 1],
  ['of8', 'of8', 'user', 'of8@eastgate.in', 'password123', 1],
  ['tf1', 'tf1', 'user', 'tf1@eastgate.in', 'password123', 1],
  ['tf2', 'tf2', 'user', 'tf2@eastgate.in', 'password123', 1],
  ['tf3', 'tf3', 'user', 'tf3@eastgate.in', 'password123', 1],
  ['tf4', 'tf4', 'user', 'tf4@eastgate.in', 'password123', 1],
  ['tf5', 'tf5', 'user', 'tf5@eastgate.in', 'password123', 1],
  ['tf6', 'tf6', 'user', 'tf6@eastgate.in', 'password123', 1],
  ['tf7', 'tf7', 'user', 'tf7@eastgate.in', 'password123', 1],
  ['tf8', 'tf8', 'user', 'tf8@eastgate.in', 'password123', 1],
  ['tg1', 'tg1', 'user', 'tg1@eastgate.in', 'password123', 1],
  ['tg2', 'tg2', 'user', 'tg2@eastgate.in', 'password123', 1],
  ['tg3', 'tg3', 'user', 'tg3@eastgate.in', 'password123', 1],
  ['tg4', 'tg4', 'user', 'tg4@eastgate.in', 'password123', 1],
  ['tg5', 'tg5', 'user', 'tg5@eastgate.in', 'password123', 1],
  ['tg6', 'tg6', 'user', 'tg6@eastgate.in', 'password123', 1],
  ['tg7', 'tg7', 'user', 'tg7@eastgate.in', 'password123', 1],
  ['tg8', 'tg8', 'user', 'tg8@eastgate.in', 'password123', 1]
];
let tableName='users';

exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');

  return knex(tableName)
    .del()   // Deletes ALL existing entries
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
      name: data[0],
      first_name: data[1],
      last_name: data[2],
      email: data[3],
      password: bcrypt.hashSync(data[4], 10),
      confirmed: data[5]
    };
  }
};
