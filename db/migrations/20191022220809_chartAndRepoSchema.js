exports.up = (knex) => Promise.all([
  knex.schema.createTable('helm_repos', (t) => {
    t.uuid('id')
      .primary()
      .notNullable();
    t.string('name')
      .notNullable()
      .comment('Repo name');
    t.string('url')
      .notNullable()
      .comment('Repo url');
    t.timestamp('last_checked_at')
      .defaultTo(knex.fn.now());
    t.timestamps(true, true);
  })
    .createTable('helm_charts', (t) => {
      t.uuid('id')
        .primary()
        .notNullable();
      t.string('name');
      t.uuid('helmRepoId')
        .references('helm_repos.id')
        .onDelete('RESTRICT');
      t.unique(['name', 'helmRepoId']);
    })
    .createTable('helm_chartVersions', (t) => {
      t.uuid('id')
        .primary()
        .notNullable();
      t.string('appVersion');
      t.timestamp('created');
      t.text('description');
      t.string('digest');
      t.string('home');
      t.specificType('keywords', 'TEXT[]')
        .nullable();
      t.specificType('maintainers', 'TEXT[]')
        .nullable();
      t.specificType('sources', 'TEXT[]')
        .nullable();
      t.specificType('urls', 'TEXT[]')
        .nullable();
      t.string('version');
      t.uuid('helmChartId')
        .notNullable()
        .references('helm_charts.id')
        .onDelete('RESTRICT');
      t.unique(['helmChartId', 'version']);
    }),
]);

exports.down = (knex) => Promise.all([
  knex.schema.dropTable('helm_repos'),
]);
