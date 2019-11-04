const pg = require('pg');

const url = process.env['database-uri'] || 'postgresql://pguser:pgpass@localhost:5432/pgdb';
console.log(process.env);
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
