
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('role_user');

  	return knex.schema.createTable('role_user', function(table){
  		table.increments().primary();
  		table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
  		table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('role_user');
};
