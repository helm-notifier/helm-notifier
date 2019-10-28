const _ = require('lodash');
const knex = require('../db');

const tableName = 'subscriptions';

async function create(ctx) {
  const data = _.pick(ctx.params, ['source_type', 'source_id']);
  data.user_id = ctx.state.user.id
  console.log(data);
  const dbObj = await knex(tableName)
    .insert(data)
    .returning('*')
    .catch((err) => {
      if (err.code === '23505') {
        const collumn = err.detail.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '');
        throw new Error(`Duplicate entry for ${collumn}`);
      } else {
        throw err;
      }
    });
  return dbObj[0];
}

module.exports = {
  create,
};
