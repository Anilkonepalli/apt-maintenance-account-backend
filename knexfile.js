// Update with your config settings.

require('dotenv').config();  // loads key-values in .env file into process.env

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: process.env.dev_database,
      user: process.env.dev_user,
      password: process.env.dev_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: false
  },

  demo: {
    client: 'mysql',
    connection: {
      database: process.env.demo_database,
      user: process.env.demo_user,
      password: process.env.demo_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },


  production: {
    client: 'mysql',
    connection: {
      database: process.env.prod_database,
      user: process.env.prod_user,
      password: process.env.prod_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  testing: {
    client: 'mysql',
    connection: {
      database: process.env.test_database,
      user: process.env.test_user,
      password: process.env.test_password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
