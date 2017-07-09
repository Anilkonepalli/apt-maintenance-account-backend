exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('infos');

	return knex.schema.createTable('infos', function(table){
		table.increments().primary();
		table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
		table.string('key', 25).notNull();
		table.string('value', 256).notNull();
		table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('infos');
};
