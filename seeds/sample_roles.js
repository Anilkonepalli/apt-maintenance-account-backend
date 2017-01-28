
exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');

  // Deletes ALL existing entries
  return knex('roles')
    .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('roles').insert({
                        name: 'guest', 
                        display_name: 'Guest Role', 
                        description: 'A role to view records such as accounts, user profiles',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('roles').insert({
                        name: 'member', 
                        display_name: 'Member Role', 
                        description: 'A role to update records such as user profiles',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('roles').insert({
                        name: 'supervisor', 
                        display_name: 'Supervisor Role', 
                        description: 'A role to add/edit records such as accounts',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('roles').insert({
                        name: 'manager', 
                        display_name: 'Manager Role', 
                        description: 'A role to delete records such as accounts',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('roles').insert({
                        name: 'admin', 
                        display_name: 'Administrator Role', 
                        description: 'A role to add/edit/delete records such as Roles, Permissions, Users',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),        
      ]);
    });
};
