exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('roles');

  	return knex.schema.createTable('roles', function(table){
   		table.increments().primary();
  		table.string('name', 25).notNull().unique();
  		table.string('description', 255).nullable();
      table.string('inherits', 255).nullable(); /* holds comma separated role ids */
			table.integer('owner_id').defaultTo(0); // owner_id as 0 indicates admin only access; here owner means who entered this record
	   	table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('roles');
};
