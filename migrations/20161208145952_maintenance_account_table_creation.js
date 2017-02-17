exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('maintenance_accounts');

  	return knex.schema.createTable('maintenance_accounts', function(table){
  		table.increments().primary();
  		table.string('item', 40).nullable();
  		table.string('flat_number', 2).notNull();
  		table.integer('for_month').notNull();
  		table.integer('for_year').notNull();
  		table.string('name', 20).nullable();
  		table.string('crdr', 2).notNull();
  		table.decimal('amount').nullable();
  		table.decimal('balance').nullable();
  		table.string('category', 25).nullable();
  		table.timestamp('recorded_at').nullable();
  		table.string('remarks', 254).nullable();
      table.integer('owner_id').defaultTo(0); // owner id as 0 indicates admin only access
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('maintenance_accounts');
};
