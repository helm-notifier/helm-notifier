const Router = require('@koa/router');
const { markdown } = require('markdown');
const fs = require('fs');
const { promisify } = require('util');
const dirTree = require('directory-tree');
const helmRepoModel = require('../models/helmRepos.model');
const helmChartModel = require('../models/helmCharts.model');
const helmChartVersionModel = require('../models/helmChartVersions.model');
const diffChartTemplates = require('../utils/diffHelmCharts');

const readFileAsync = promisify(fs.readFile);

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.redirect('/repos');
  return next();
});

router.get('/repos', async (ctx, next) => {
  const repos = await helmRepoModel.listRepos();
  await ctx.render('app/repos', { repos });
  return next();
});


router.get('/repos/:repoName', async (ctx, next) => {
  // const { id } = await helmRepoModel.getRepo(ctx.params.repoName);
  let charts = await helmChartModel.listByRepoName(ctx.params.repoName);
  charts = charts.map((chart) => {
    const updatedChart = chart;
    updatedChart.repo = {};
    updatedChart.repo.name = ctx.params.repoName;
    return updatedChart;
  });
  await ctx.render('app/charts', {
    charts,
  });
  return next();
});

router.get('/repos/:repoName/:chartName/:version?', async (ctx, next) => {
  const chart = await helmChartModel.getChart(ctx.params.repoName, ctx.params.chartName);
  chart.versions = await helmChartVersionModel.findByChartId(chart.id);
  const tmpFolder = await diffChartTemplates.createTempFolder();
  let selectedVersion;
  if (ctx.params.version === undefined) {
    [selectedVersion] = chart.versions;
  } else {
    selectedVersion = chart.versions.find((ch) => ch.version === ctx.params.version);
  }
  const { repoUrl } = chart;
  const chartPath = await diffChartTemplates.downloadChart(selectedVersion, tmpFolder, repoUrl);
  const tree = dirTree(chartPath, { extensions: /\.(md|yaml)$/ });
  const chartYaml = tree.children[0].children.find((file) => file.name === 'Chart.yaml');
  const readme = tree.children[0].children.find((file) => file.name.toLowerCase() === 'readme.md');
  const readmeContent = await readFileAsync(readme.path, 'utf8');
  const readmehtml = markdown.toHTML(readmeContent)
  await ctx.render('app/chart', {
    readmehtml,
    chart,
    repoName: ctx.params.repoName,
  });
  return next();
});

router.get('/repos/:repoName/:chartName/compare/:versions', async (ctx, next) => {
  const chart = await helmChartModel.getChart(ctx.params.repoName, ctx.params.chartName);
  const [version1, version2] = ctx.params.versions.split('...');
  const { repoUrl } = chart;
  const charts = await helmChartVersionModel.getTwoChartVersion(chart.id, version1, version2);
  const chart1 = charts.find((chartVersion) => chartVersion.version === version1);
  const chart2 = charts.find((chartVersion) => chartVersion.version === version2);

  const diffHtml = await diffChartTemplates.diffChartTemplates(chart1, chart2, repoUrl);
  await ctx.render('app/chartCompare', {
    repoName: ctx.params.repoName,
    chartName: ctx.params.chartName,
    diffHtml,
  });
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
