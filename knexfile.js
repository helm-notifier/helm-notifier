const pg = require('pg');
const configUtil = require('./utils/config');

const url = configUtil('database-uri') || 'postgresql://pguser:pgpass@localhost:5432/pgdb';
if (configUtil('database-uri') !== undefined) {
  pg.defaults.ssl = true;
}
console.log(`Connecting to ${url.replace(/:[^:]+@/, ':***@')}`);

module.exports = {
  client: 'pg',
  connection: url,
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  },
};
