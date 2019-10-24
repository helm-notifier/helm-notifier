const uuid = require('uuid/v4');
const _ = require('lodash');
const knex = require('../db');

const tableName = 'helm_chartVersions';

async function create(chartData, chartId) {
  const data = _.pick(chartData, [
    'appVersion',
    'created',
    'description',
    'digest',
    'home',
    'keywords',
    'maintainers',
    'sources',
    'urls',
    'version',
  ]);
  data.helmChartId = chartId;
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

async function getTwoChartVersion(chartId, version1, version2) {
  const charts = await knex(tableName)
    .where(function () {
      this.where('version', version1)
        .orWhere('version', version2);
    })
    .andWhere('helmChartId', chartId)
    .select();
  return charts;
}

async function findByChartId(chartId) {
  const repos = await knex(tableName)
    .where({ helmChartId: chartId })
    .orderByRaw('string_to_array(version, \'.\')::int[];')
    .select();
  return repos.reverse();
}

module.exports = {
  create,
  findByChartId,
  getTwoChartVersion,
};
