const _ = require('lodash');
const uuid = require('uuid/v4');
const knex = require('../db');

async function listRepos() {
  const repos = await knex('helm_repos')
    .select();
  return repos;
}

async function createRepo(repo) {
  const data = _.pick(repo, ['name', 'url']);
  data.id = uuid();

  const dbObj = await knex('helm_repos')
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

async function getRepo(repoName) {
  const dbObj = await knex('helm_repos')
    .select()
    .where({ name: repoName })
    .first()
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (dbObj === undefined) {
    throw new Error(`Repo not found ${repoName}`);
  }
  return dbObj;
}

module.exports = {
  listRepos,
  createRepo,
  getRepo,
};
