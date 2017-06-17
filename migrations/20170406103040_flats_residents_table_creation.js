exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('flats_residents');

  	return knex.schema.createTable('flats_residents', function(table){
  		table.increments().primary();
  		table.integer('flat_id').unsigned().references('flats.id').onDelete('CASCADE');
  		table.integer('resident_id').unsigned().references('residents.id').onDelete('CASCADE');
			table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
			table.timestamp('updated_at').nullable();
  	});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('flats_residents');
};
