exports.up = (knex) => knex.schema.table('helm_charts', (t) => {
  t.string('icon_url');
});
exports.down = (knex) => knex.schema.table('helm_charts', (t) => {
  t.dropColumn('icon_url');
});
