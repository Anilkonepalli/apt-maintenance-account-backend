
exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');

  // Deletes ALL existing entries
  return knex('permissions')
    .del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('permissions').insert({
                        operations: 'R',
                        resource: 'accounts',
                        condition: null,
                        description: 'Authorize to read/view Account records'
                      }),
        knex('permissions').insert({
                        operations: 'CRUD',
                        resource: 'users',
                        condition: '(params)=>{return params.user.id === params.loggedUser.id;}',
                        description: 'Authorize to create/read/update/delete own user profile'
                      }),
        knex('permissions').insert({
                        operations: 'CRUD',
                        resource: 'accounts',
                        condition: null,
                        description: 'Authorize to create/read/update/delete any account record'
                      }),
        knex('permissions').insert({ 
                        operations: 'UD',
                        resource: 'accounts',
                        condition: '(params)=>{return params.user.id === params.account.owner_id;}',
                        description: 'Authorize to update/delete own account record'
                      }),
        knex('permissions').insert({
                        operations: 'CRUD',
                        resource: 'roles',
                        condition: null,
                        description: 'Authorize to create/read/update/delete any role'
                      }),        
      ]);
    });
};
