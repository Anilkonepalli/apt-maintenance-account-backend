exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('durations');

	return knex.schema.createTable('durations', function(table){
		table.increments().primary();
		table.string('key', 25).notNull();
		table.string('value', 256).notNull();
		table.string('effective_from', 10).notNull();
		table.string('effective_to', 10).notNull();
		table.string('remarks', 254).nullable();
		table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		table.timestamp('updated_at').nullable();
		table.timestamp('deleted_at').nullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('durations');
};
