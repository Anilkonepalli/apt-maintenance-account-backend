
exports.up = function(knex, Promise) {

  knex.schema.dropTableIfExists('flats');

  	return knex.schema.createTable('flats', function(table){
  		table.increments().primary();
  		table.string('block_number', 20).notNull().defaultTo('0'); // empty string means no block number exists
  		table.string('flat_number', 20).notNull();
  		table.string('remarks', 254).nullable();
      table.integer('owner_id').defaultTo(0); // owner id as 0 indicates admin only access
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
      table.unique(['block_number', 'flat_number']);
  	});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('flats');
};
