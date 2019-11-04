const pg = require('pg');
const configUtil = require('./utils/config');


const url = configUtil('database-uri') || 'postgresql://pguser:pgpass@localhost:5432/pgdb';
console.log(`Connecting to ${url.replace(/:[^:]+@/, ':***@')}`);

module.exports = {
  client: 'pg',
  connection: configUtil('database-uri') ? `${url}?sslmode=require` : url,
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
