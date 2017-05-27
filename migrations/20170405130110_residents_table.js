
exports.up = function(knex, Promise) {

  knex.schema.dropTableIfExists('residents');

  	return knex.schema.createTable('residents', function(table){
  		table.increments().primary();
  		table.string('first_name', 20).notNull();
  		table.string('last_name', 20).nullable();
      table.string('is_a', 20).notNull().defaultTo('owner'); // is_a can be of owner, relative, tenant, friend, guest to a Flat(s)
  		table.string('remarks', 254).nullable();
      table.integer('owner_id').defaultTo(0); // owner_id as 0 indicates admin only access; here owner means who entered this record
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
      table.unique(['first_name', 'last_name', 'is_a']);
  	});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('residents');
};
