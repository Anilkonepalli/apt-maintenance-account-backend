
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('permission_role');

  	return knex.schema.createTable('permission_role', function(table){
  		table.increments().primary();
  		table.integer('permission_id').unsigned().references('permissions.id').onDelete('CASCADE');
  		table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permission_role');
};
