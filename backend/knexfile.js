const pg = require('pg');

const url = process.env.DATABASE_URI || 'postgresql://pguser:pgpass@localhost:5432/pgdb';
if (url.includes('ondigitalocean.com')) {
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
