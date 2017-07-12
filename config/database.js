require('dotenv').config();  // loads key-values in .env file into process.env

// Select correct database config object for the current environment
var knex = require('knex')(require('../knexfile')[process.env.NODE_ENV]);
var bookshelf = require('bookshelf')(knex);

// plugin to support softDelete
bookshelf.plugin(require('bookshelf-paranoia'));

// plugin to support cascadeDelete, but softDelete does not work,
// so unable to use it now; leaving it here for ref / future use / avoid re-attempt
// bookshelf.plugin(require('bookshelf-cascade-delete'));

// Resolve circular dependencies with relations
bookshelf.plugin('registry');

module.exports = bookshelf;
