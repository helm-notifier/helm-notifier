const _ = require('lodash');
const uuid = require('uuid/v4');
const knex = require('../db');

const tableName = 'helm_repos';

async function listRepos() {
  const repos = await knex(tableName)
    .select();
  return repos;
}

async function createRepo(repo) {
  const data = _.pick(repo, ['name', 'url']);
  data.id = uuid();

  const dbObj = await knex(tableName)
    .insert(data)
    .returning('*')
    .catch((err) => {
      if (err.code === '23505') {
        const collumn = err.detail.match(/\((.*?)\)/g)[0].replace('(', '')
          .replace(')', '');
        throw new Error(`Duplicate entry for ${collumn}`);
      } else {
        throw err;
      }
    });
  return dbObj[0];
}

async function getRepo(repoName) {
  const dbObj = await knex(tableName)
    .select()
    .where({ name: repoName })
    .first();
  if (dbObj === undefined) {
    throw new Error(`Repo not found ${repoName}`);
  }
  return dbObj;
}

async function getRepoById(ctx) {
  return knex(tableName)
    .select()
    .where({ id: ctx.params.repoId })
    .first();
}

module.exports = {
  listRepos,
  createRepo,
  getRepo,
  getRepoById,
};
