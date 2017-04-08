
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('residents').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('residents').insert({first_name: 'Hari', last_name: ''}),
        knex('residents').insert({first_name: 'Prab', last_name: ''}),
        knex('residents').insert({first_name: 'Pret', last_name: ''}),
        knex('residents').insert({first_name: 'Moha', last_name: ''}),
        knex('residents').insert({first_name: 'Jeri', last_name: ''}),
        knex('residents').insert({first_name: 'Srid', last_name: ''}),
        knex('residents').insert({first_name: 'Srin', last_name: ''}),
        knex('residents').insert({first_name: 'Muth', last_name: ''}),
        knex('residents').insert({first_name: 'Arun', last_name: ''}),
        knex('residents').insert({first_name: 'Jaya', last_name: ''}),
        knex('residents').insert({first_name: 'Ezhi', last_name: ''}),
        knex('residents').insert({first_name: 'Yoga', last_name: ''}),

        knex('residents').insert({first_name: 'Ownerf1', last_name: ''}),
        knex('residents').insert({first_name: 'Ownerf2', last_name: ''}),
        knex('residents').insert({first_name: 'Ownerf5', last_name: ''}),
        knex('residents').insert({first_name: 'Ownerf8', last_name: ''}),
        knex('residents').insert({first_name: 'Ownerg6', last_name: ''}),


        knex('residents').insert({first_name: 'Tenantf1', last_name: '', is_a: 'tenant' }),
        knex('residents').insert({first_name: 'Tenantf2', last_name: '', is_a: 'tenant'}),
        knex('residents').insert({first_name: 'Tenantf5', last_name: '', is_a: 'tenant'}),
        knex('residents').insert({first_name: 'Tenantf8', last_name: '', is_a: 'tenant'}),
        knex('residents').insert({first_name: 'Tenantg4', last_name: '', is_a: 'tenant'}),
        knex('residents').insert({first_name: 'Tenantg6', last_name: '', is_a: 'tenant'}),
      ]);
    });
};
