const Router = require('@koa/router');
const helmRepoModel = require('../models/helmRepos.model');
const helmChartModel = require('../models/helmCharts.model');
const helmChartVersionModel = require('../models/helmChartVersions.model');
const diffChartTemplates = require('../utils/diffHelmCharts');

const router = new Router();

router.get('/repos', async (ctx, next) => {
  const repos = await helmRepoModel.listRepos();
  ctx.response.body = repos;
  return next();
});

router.get('/repos/:repoName', async (ctx, next) => {
  const charts = await helmChartModel.listByRepoName(ctx.params.repoName);
  ctx.response.body = charts;
  return next();
});

router.get('/repos/:repoName/:chartName/:version?', async (ctx, next) => {
  const chart = await helmChartModel.getChart(ctx.params.repoName, ctx.params.chartName);
  chart.versions = await helmChartVersionModel.findByChartId(chart.id);
  let selectedVersion;
  if (ctx.params.version === undefined) {
    [selectedVersion] = chart.versions;
  } else {
    selectedVersion = chart.versions.find((ch) => ch.version === ctx.params.version);
  }
  const { repoUrl } = chart;
  const chartTree = await diffChartTemplates.readHelmChart(selectedVersion, repoUrl);
  ctx.response.body = {
    chartTree,
    chart,
    repoName: ctx.params.repoName,
  };
  return next();
});

router.get('/repos/:repoName/:chartName/compare/:versions', async (ctx, next) => {
  const chart = await helmChartModel.getChart(ctx.params.repoName, ctx.params.chartName);
  const [version1, version2] = ctx.params.versions.split('...');
  const { repoUrl } = chart;
  const charts = await helmChartVersionModel.getTwoChartVersion(chart.id, version1, version2);
  const chart1 = charts.find((chartVersion) => chartVersion.version === version1);
  const chart2 = charts.find((chartVersion) => chartVersion.version === version2);

  const diff = await diffChartTemplates.diffChartTemplates(chart1, chart2, repoUrl);
  ctx.response.body = diff;
  return next();
});

router.get('/search', async (ctx, next) => {
  const helmRepos = await helmRepoModel.listRepos();
  let charts = await helmChartModel.search(ctx);
  charts = charts.map((chart) => {
    const updatedChart = chart;
    updatedChart.repo = helmRepos.find((repo) => repo.id === chart.helmRepoId);
    return chart;
  });
  await ctx.render('app/charts', { charts });
  return next();
});
module.exports = router;
