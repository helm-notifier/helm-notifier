const uuid = require('uuid/v4');
const _ = require('lodash');
const compareVersions = require('compare-versions');
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
    .select();
  const sorted = repos.sort((a, b) => {
    let sortVal = -1;
    try {
      sortVal = compareVersions(a.version, b.version);
    } catch (e) {
      if (e.message.includes('Invalid argument not valid semver')) {
        const errorSemVer = e.message.split('(\'')[1].split('\' ')[0];
        if (errorSemVer.includes('_')) {
          sortVal = compareVersions(a.version.replace('_', '-'), b.version.replace('_', '-'));
        } else if (errorSemVer === '1.2-canary') {
          let versionA = a.version;
          let versionB = b.version;
          if (versionA === '1.2-canary') {
            versionA = '1.2.0-canary';
          }
          if (versionB === '1.2-canary') {
            versionB = '1.2.0-canary';
          }
          sortVal = compareVersions(versionA, versionB);
        } else if (errorSemVer === '0.1.5a') {
          let versionA = a.version;
          let versionB = b.version;
          if (versionA === '0.1.5a') {
            versionA = '0.1.5-a';
          }
          if (versionB === '0.1.5a') {
            versionB = '0.1.5-a';
          }
          sortVal = compareVersions(versionA, versionB);
        } else {
          throw e;
        }
      }
    }
    return sortVal;
  });
  return sorted.reverse();
}

module.exports = {
  create,
  findByChartId,
  getTwoChartVersion,
};
