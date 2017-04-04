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
                        description: 'A role to view records such as accounts, user profiles'
                      }),
        knex('roles').insert({
                        name: 'member', 
                        description: 'A role to update records such as user profiles',
                        inherits: 'guest'
                      }),
        knex('roles').insert({
                        name: 'supervisor', 
                        description: 'A role to add/edit records such as accounts'
                      }),
        knex('roles').insert({
                        name: 'manager', 
                        description: 'A role to delete records such as accounts',
                        inherits: 'member,supervisor'
                      }),
        knex('roles').insert({
                        name: 'admin', 
                        description: 'A role to add/edit/delete records such as Roles, Permissions, Users',
                        inherits: 'manager'
                      }),        
      ]);
    });
};
