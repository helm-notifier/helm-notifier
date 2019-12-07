const { helm } = require('../helpers');
const { repository } = require('../app/models');

module.exports = async () => {
  const repos = await helm.getRepos();
  try {
    await repository.bulkCreate(repos);
  } catch (e) {
    if (e.name !== 'SequelizeUniqueConstraintError') {
      throw e;
    }
  }
  return Promise.resolve();
};
