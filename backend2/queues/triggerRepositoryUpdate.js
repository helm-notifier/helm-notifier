const bull = require('../bull');
const { repository } = require('../app/models');

module.exports = async () => {
  const repos = await repository.findAll();
  return Promise.all(repos.map((repo) => bull.add('updateRepository', { repo })));
};
