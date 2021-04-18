
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.MYSQLPORT
  },
  pool: { min: +process.env.POOL_MIN, max: +process.env.POOL_MAX }
});

module.exports = knex;

