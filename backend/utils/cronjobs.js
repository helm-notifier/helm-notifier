const Promise = require('bluebird');
const _ = require('lodash');
const helmRepoUtil = require('./helmRepos');
const helmRepoModel = require('../models/helmRepos.model');
const helmChartModel = require('../models/helmCharts.model');
const helmChartVersionModel = require('../models/helmChartVersions.model');
const notificationModel = require('../models/notifactions.model');
const subscriberModel = require('../models/subscriptions.model');
const diffHelmCharts = require('./diffHelmCharts');
const semVerSortFunction = require('../utils/sortSemVer');
const yaml = require('js-yaml');

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

async function updateChartData(chart, chartData) {
  // Keywords, latest version -> app version
  const uniqKeywords = _.chain(chartData)
    .map((data) => data.keywords)
    .flatten()
    .uniq()
    .filter()
    .value();
  const latestChart = chartData[0];
  const helmRepo = await helmRepoModel.getRepoById({ params: { repoId: chart.helmRepoId } });
  const fileTree = await diffHelmCharts.readHelmChart(latestChart, helmRepo.url);
  const chartYaml = fileTree.children.find((file) => file.name.toLowerCase() === 'chart.yaml');
  let icon;
  try {
    icon = yaml.safeLoad(chartYaml.content).icon;
  } catch (e) {
    console.log(e);
  }
  return helmChartModel
    .updateChartData(chart, uniqKeywords, latestChart.appVersion, latestChart.version, icon);
}

async function updateChartVersions(chart, chartsData) {
  let changes = false;
  const dbChartVersions = await helmChartVersionModel.findByChartId(chart.id);
  const dbChartVersionsUpdated = await Promise.all(chartsData.map(async (chartData) => {
    let found = dbChartVersions
      .find((dbChartVersion) => dbChartVersion.version === chartData.version);
    if (found === undefined) {
      try {
        found = await helmChartVersionModel.create(chartData, chart.id);
        changes = true;
        const userIdsObj = await subscriberModel.getSubscribers('chartVersionUpdate', chart.id);
        const userIdsArr = userIdsObj.map((userIdObj) => userIdObj.user_id);
        await notificationModel.create(userIdsArr, chart.id, 'chartVersionUpdate', found.id, 'chartVersion');
      } catch (e) {
        if (!e.message.includes('Duplicate entry for "helmChartId", version')) {
          throw e;
        }
        // Todo: create notification if something fails this is super
        //  important since it might be the first spot for
        //  something that has been changed.
      }
    }
    return found;
  }));
  if (changes === true) {
    await updateChartData(chart, dbChartVersionsUpdated.filter((ele) => ele !== undefined)
      .sort(semVerSortFunction)
      .reverse());
  }
  return dbChartVersionsUpdated.sort(semVerSortFunction)
    .reverse();
}

async function updateCharts(repo) {
  const repoData = await helmRepoUtil.getCharts(repo.url);
  const dbCharts = await helmChartModel.listByRepoId(repo.id);
  // Todo: bulk get version data instead of one by one in the updateChart function
  await Promise.all(_.map(repoData.entries, async (chart, chartName) => {
    let found = dbCharts.find((dbChart) => dbChart.name === chartName);
    if (found === undefined) {
      found = await helmChartModel.create(chartName, repo.id);
      // Todo: create Notifcation once a new chart is added to a repo
    }
    await updateChartVersions(found, chart);
    return Promise.resolve();
  }));

  return Promise.resolve();
}

async function updateRepo() {
  // Todo: timeout logic
  const repos = await helmRepoModel.listRepos();
  await Promise.map(repos, async (repo) => {
    const trans = apm.startTransaction('update repo', 'cronjob');
    await updateCharts(repo);
    trans.end('success');
    return Promise.resolve();
  }, { concurrency: 3 });
  return Promise.resolve();
}

module.exports = {
  updateRepo,
  updateRepos,
  updateCharts,
};
