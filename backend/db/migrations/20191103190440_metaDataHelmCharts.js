exports.up = (knex) => knex.schema.table('helm_charts', (t) => {
  t.specificType('keywords', 'TEXT[]')
    .nullable();
  t.string('version');
  t.string('appVersion');
});
exports.down = (knex) => knex.schema.table('helm_charts', (t) => {
  t.dropColumn('keywords');
  t.dropColumn('version');
  t.dropColumn('appVersion');
});
