exports.up = function(knex, Promise) {

	knex.schema.dropTableIfExists('permissions');

  	return knex.schema.createTable('permissions', function(table){
  		table.increments().primary();
  		table.string('operations', 4).defaultTo('CRUD'); // by default CRUD operations are set
      table.string('resource', 25).defaultTo('*'); // by default all tables
      table.string('condition', 180).nullable(); // function(params) { return params.user.id === params.post.id}
      table.unique(['operations', 'resource', 'condition']);
  		table.string('description', 255).nullable();
			table.integer('owner_id').defaultTo(0); // owner_id as 0 indicates admin only access; here owner means who entered this record
		  table.timestamp('created_at').nullable().defaultTo(knex.fn.now());
		  table.timestamp('updated_at').nullable();
		  table.timestamp('deleted_at').nullable();
  	});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('permissions');
};
