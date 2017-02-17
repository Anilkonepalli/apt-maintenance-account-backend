exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('permissions_roles');

  	return knex.schema.createTable('permissions_roles', function(table){
  		table.increments().primary();
  		table.integer('permission_id').unsigned().references('permissions.id').onDelete('CASCADE');
  		table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
  	});
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permissions_roles');
};
