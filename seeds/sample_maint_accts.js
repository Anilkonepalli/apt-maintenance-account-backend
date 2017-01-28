
exports.seed = function(knex, Promise) {
  var bcrypt = require('bcrypt');
  
  // Deletes ALL existing entries
  return knex('maintenance_accounts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('maintenance_accounts').insert({
                        item: 'test item 1',
                        flat_number: '01',
                        for_month: 12,
                        for_year: 2016,
                        name: 'test owner1',
                        crdr: 'cr',
                        amount: 600.00,
                        balance: 600.00,
                        category: 'Monthly maintenance',
                        recorded_at: '2016-12-08T00:00:00',
                        remarks: 'testing new app',
                        owner_id: 0,
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),

        knex('maintenance_accounts').insert({
                        item: 'test item 2',
                        flat_number: '02',
                        for_month: 12,
                        for_year: 2016,
                        name: 'test owner2',
                        crdr: 'cr',
                        amount: 600.00,
                        balance: 600.00,
                        category: 'Monthly maintenance',
                        recorded_at: '2016-12-08T00:00:00',
                        remarks: 'testing new app', 
                        owner_id: 0,
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      }),

        knex('maintenance_accounts').insert({
                        item: 'test item 3',
                        flat_number: '03',
                        for_month: 12,
                        for_year: 2016,
                        name: 'test owner3',
                        crdr: 'cr',
                        amount: 600.00,
                        balance: 600.00,
                        category: 'Monthly maintenance',
                        recorded_at: '2016-12-08T00:00:00',
                        remarks: 'testing new app', 
                        owner_id: 0,
                        created_at: knex.fn.now(),
                        updated_at: knex.fn.now()
                      })        

      ]);
    });
};
