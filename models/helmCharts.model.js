const uuid = require('uuid/v4');
const knex = require('../db');

async function getChart(chartName, repoId) {
  console.log('');
}

async function listByRepoId(repoId) {
  const repos = await knex('helm_charts')
    .where({ helmRepoId: repoId })
    .select();
  return repos;
}

async function listByRepoName(repoName) {
  const repos = await knex('helm_charts')
    .join('helm_repos', 'helm_charts.helmRepoId', 'helm_repos.id')
    .where('helm_repos.name', repoName)
    .options({ rowMode: 'array' });
    // .select();
  return repos;
}


async function list() {
  const repos = await knex('helm_charts')
    .select();
  return repos;
}

async function create(chartName, repoId) {
  const id = uuid();

  const dbObj = await knex('helm_charts')
    .insert({
      id,
      helmRepoId: repoId,
      name: chartName,
    })
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
  getChart,
  create,
  listByRepoId,
  listByRepoName,
  list,
};
