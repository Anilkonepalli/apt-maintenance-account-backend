
exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('roles_users');

  	return knex.schema.createTable('roles_users', function(table){
  		table.increments().primary();
  		table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
  		table.integer('role_id').unsigned().references('roles.id').onDelete('CASCADE');
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
  	});
  
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('roles_users');
};
