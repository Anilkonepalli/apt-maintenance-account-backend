
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('flats').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('flats').insert({flat_number: 'G1'}),
        knex('flats').insert({flat_number: 'G2'}),
        knex('flats').insert({flat_number: 'G3'}),
        knex('flats').insert({flat_number: 'G4'}),
        knex('flats').insert({flat_number: 'G5'}),
        knex('flats').insert({flat_number: 'G6'}),
        knex('flats').insert({flat_number: 'G7'}),
        knex('flats').insert({flat_number: 'G8'}),
        knex('flats').insert({flat_number: 'F1'}),
        knex('flats').insert({flat_number: 'F2'}),
        knex('flats').insert({flat_number: 'F3'}),
        knex('flats').insert({flat_number: 'F4'}),
        knex('flats').insert({flat_number: 'F5'}),
        knex('flats').insert({flat_number: 'F6'}),
        knex('flats').insert({flat_number: 'F7'}),
        knex('flats').insert({flat_number: 'F8'})
      ]);
    });
};
