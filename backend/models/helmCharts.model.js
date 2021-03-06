const uuid = require('uuid/v4');
const knex = require('../db');

const tableName = 'helm_charts';

async function getChart(repoName, chartName) {
  const charts = await knex(tableName)
    .select('helm_repos.url as repoUrl', 'helm_charts.*')
    .join('helm_repos', 'helm_charts.helmRepoId', 'helm_repos.id')
    .where('helm_repos.name', repoName)
    .where('helm_charts.name', chartName)
    .first();
  return charts;
}

async function listByRepoId(repoId) {
  const charts = await knex(tableName)
    .where({ helmRepoId: repoId })
    .select();
  return charts;
}

async function listByRepoName(repoName) {
  const charts = await knex(tableName)
    .select('helm_repos.name as repo_name', 'helm_charts.*')
    .join('helm_repos', 'helm_charts.helmRepoId', 'helm_repos.id')
    .where('helm_repos.name', repoName)
    .orderBy('helm_charts.name');
  return charts;
}

async function create(chartName, repoId) {
  const id = uuid();

  const dbObj = await knex(tableName)
    .insert({
      id,
      helmRepoId: repoId,
      name: chartName,
    })
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

async function search(ctx) {
  const searchTerm = ctx.query.query;
  const dbObjs = await knex(tableName)
    .select()
    .where('name', 'like', `%${searchTerm}%`);
  return dbObjs;
}

async function updateChartData(chart, keywords, appVersion, chartVersion, icon_url) {
  return knex(tableName)
    .where('id', chart.id)
    .update({
      keywords,
      appVersion,
      version: chartVersion,
      icon_url,
    });
}

async function getChartById(ctx) {
  return knex(tableName)
    .select()
    .where({ id: ctx.params.chartId });
}

module.exports = {
  getChartById,
  getChart,
  create,
  search,
  listByRepoId,
  listByRepoName,
  updateChartData,
};
