
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('permissions');

  	return knex.schema.createTable('permissions', function(table){
  		table.increments().primary();
  		table.string('name', 25).unique();
  		table.string('display_name', 50);
  		table.string('description', 255);
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permissions');
};
