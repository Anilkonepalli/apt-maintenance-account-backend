
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('residents').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('residents').insert({first_name: 'mohan', last_name: 'anna'}),
        knex('residents').insert({first_name: 'priya', last_name: 'anna'}),
        knex('residents').insert({first_name: 'preethi', last_name: 'anna'})
      ]);
    });
};
