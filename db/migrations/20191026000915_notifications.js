
exports.up = (knex) => knex.schema.createTable('notifications', (t) => {
  t.timestamps(true, true);
  t.increments('id');
  t.integer('user_id')
    .notNullable()
    .references('users.id')
    .onDelete('RESTRICT');
  t.uuid('source_id')
    .notNullable();
  t.text('source_type')
    .notNullable();
  t.timestamp('read_at');
}).createTable('subscriptions', (t) => {
  t.timestamps(true, true);
  t.increments('id');
  t.integer('user_id')
    .notNullable()
    .references('users.id')
    .onDelete('RESTRICT');
  t.uuid('source_id')
    .notNullable();
  t.text('source_type')
    .notNullable();
  t.unique(['user_id', 'source_id', 'source_type']);
});

exports.down = (knex) => knex.schema.dropTable('notifications');
