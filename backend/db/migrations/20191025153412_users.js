exports.up = function (knex) {
  return Promise.all([knex.schema.createTable('users', (t) => {
    t.timestamps(true, true);
    t.increments('id');
    t.string('email');
    t.unique('email');
    t.string('password');
  })]);
};

exports.down = (knex) => knex.schema.dropTable('users');
