
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('maintenance_accounts');

  	return knex.schema.createTable('maintenance_accounts', function(table){
  		table.increments().primary();
  		table.string('item', 40);
  		table.string('flat_number', 2);
  		table.integer('for_month');
  		table.integer('for_year');
  		table.string('name', 20);
  		table.string('crdr', 2);
  		table.decimal('amount');
  		table.decimal('balance');
  		table.string('category', 25);
  		table.timestamp('date').nullable();
  		table.string('remarks', 254);
		table.timestamp('created_at').nullable();
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
  	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('maintenance_accounts');
};
