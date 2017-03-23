exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('users');

	return knex.schema.createTable('users', function(table){
		table.increments().primary();
		table.string('name', 50).notNull();
		table.string('first_name', 25).nullable();
		table.string('last_name', 25).nullable();
		table.string('email', 50).notNull().unique();
		table.string('password', 60).notNull();
		table.integer('confirmed');
		table.string('confirmation_code', 50).nullable();
		table.string('social_network_id', 128).nullable();
		table.string('social_network_name', 25).nullable();
		table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('users');
};
