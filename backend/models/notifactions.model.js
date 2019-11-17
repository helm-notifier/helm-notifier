const knex = require('../db');

const tableName = 'notifications';

async function create(userIds, sourceId, sourceType, targetId, targetType) {
  const data = userIds.map((userId) => ({
    user_id: userId,
    source_type: sourceType,
    source_id: sourceId,
    target_id: targetId,
    target_type: targetType,
  }));
  await knex(tableName)
    .insert(data);
  return Promise.resolve();
}

module.exports = {
  create,
};
