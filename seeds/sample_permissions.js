
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
                          condition: NULL,
                          description: 'Grants READ ONLY permissions to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'RUD',
                          resource: 'users',
                          condition: 'return data.user_id === data.model.owner_id',
                          description: 'Grants RUD PERMISSIONS to user\'s OWN RECORDS'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'accounts',
                          condition: NULL,
                          description: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'accounts',
                          condition: 'return data.user_id == data.model.owner_id',
                          description: 'Grants READ ONLY permissions to USER SPECIFIC record'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'roles',
                          condition: NULL,
                          description: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'flats',
                          condition: NULL,
                          descriptioN: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'residents',
                          condition: NULL,
                          description: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'users',
                          condition: NULL,
                          description: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'users',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'flats',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'residents',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USER'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'roles',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'CRUD',
                          resource: 'permissions',
                          condition: NULL,
                          description: 'Grants ALL PERMISSIONS to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'permissions',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'RU',
                          resource: 'flats-residents',
                          condition: NULL,
                          description: 'Grants READ and UPDATE permissions to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'flats-residents',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'RU',
                          resource: 'users-roles',
                          condition: NULL,
                          description: 'Grants READ and UPDATE permissions to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'users-roles',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'RU',
                          resource: 'roles-permissions',
                          condition: NULL,
                          description: 'Grants READ and UPDATE permissions to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'roles-permissions',
                          condition: NULL,
                          description: 'Grants READ ONLY permission to ANY USERS',
                        }),
        knex('permissions').insert({
                          operations: 'D',
                          resource: 'accounts',
                          condition: NULL,
                          description: 'Grants DELETE permission to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'CRU',
                          resource: 'accounts',
                          condition: NULL,
                          description: 'Grants ALL but Delete permissions to ANY USERS'
                        }),
        knex('permissions').insert({
                          operations: 'R',
                          resource: 'accounts',
                          condition: 'return params.user_id === params.model.owner_id',
                          description: 'Grants READ ONLY permissions to USER SPECIFIC record'
                        }),
        knex('permissions').insert({
                          operations: 'RU',
                          resource: 'user-profile',
                          condition: 'return data.user_id === data.model.owner_id',
                          description: 'Grants RU permissions to USER\'s OWN RECORD'
                        })
      ]);
    });
};
