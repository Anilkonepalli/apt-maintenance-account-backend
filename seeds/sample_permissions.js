
exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');

  // Deletes ALL existing entries
  return knex('permissions')
    .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('permissions').insert({
                        name: 'view:accounts', 
                        display_name: 'View Account Records', 
                        description: 'Authorize to view Account records',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('permissions').insert({
                        name: 'edit:users:own', 
                        display_name: 'Edit Own User Record', 
                        description: 'Authorize to edit own user profile',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('permissions').insert({
                        name: 'add:accounts', 
                        display_name: 'Add Account', 
                        description: 'Authorize to add an account record',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('permissions').insert({
                        name: 'delete:accounts', 
                        display_name: 'Delete Account', 
                        description: 'Authorize to delete an account record',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),
        knex('permissions').insert({
                        name: 'add:roles', 
                        display_name: 'Add Role', 
                        description: 'Authorize to add a role',
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),        
      ]);
    });
};
