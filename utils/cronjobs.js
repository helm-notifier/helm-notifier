const Promise = require('bluebird');
const _ = require('lodash');
const helmRepoUtil = require('./helmRepos');
const helmRepoModel = require('../models/helmRepos.model');
const helmChartModel = require('../models/helmCharts.model');
const helmChartVersionModel = require('../models/helmChartVersions.model');
const apm = require('../elasticApm');

async function updateRepos() {
  const trans = apm.startTransaction('update Repos', 'cronjob');
  const repos = await helmRepoUtil.getRepos();
  const dbRepos = await helmRepoModel.listRepos();
  await Promise.all(repos.map(async (repo) => {
    const found = dbRepos.find((dbRepo) => repo.name === dbRepo.name);
    if (found === undefined) {
      await helmRepoModel.createRepo(repo);
      // Todo: create notifcation once a new repo is added just to inform me
    }
    return Promise.resolve();
  }));
  trans.result = 'success';
  trans.end();
}

async function updateChart(chart, chartsData) {
  const dbChartVersions = await helmChartVersionModel.findByChartId(chart.id);
  await Promise.all(chartsData.map(async (chartData) => {
    let found = dbChartVersions
      .find((dbChartVersion) => dbChartVersion.version === chartData.version);
    if (found === undefined) {
      try {
        found = await helmChartVersionModel.create(chartData, chart.id);
      } catch (e) {
        // Todo: create notification if something fails this is super
        //  important since it might be the first spot for
        //  something that has been changed.
      }
    }
    return found;
  }));
}

async function updateCharts(repoData, repoId) {
  const dbCharts = await helmChartModel.listByRepoId(repoId);
  // Todo: bulk get version data instead of one by one in the updateChart function
  await Promise.all(_.map(repoData.entries, async (chart, chartName) => {
    let found = dbCharts.find((dbChart) => dbChart.name === chartName);
    if (found === undefined) {
      found = await helmChartModel.create(chartName, repoId);
      // Todo: create Notifcation once a new chart is added to a repo
    }
    await updateChart(found, chart);
    return Promise.resolve();
  }));

  return Promise.resolve();
}

async function updateRepo() {
  // Todo: timeout logic
  const repos = await helmRepoModel.listRepos();
  await Promise.map(repos, async (repo) => {
    const trans = apm.startTransaction('update repo', 'cronjob');
    const repoData = await helmRepoUtil.getCharts(repo.url);
    await updateCharts(repoData, repo.id);
    trans.end('success');
    return Promise.resolve();
  }, { concurrency: 3 });
  return Promise.resolve();
}

module.exports = {
  updateRepo,
  updateRepos,
};
