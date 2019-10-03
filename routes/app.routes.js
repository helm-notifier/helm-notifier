const Router = require('@koa/router');
const fetch = require('node-fetch');
const yaml = require('js-yaml');
const diff2html = require('diff2html').Diff2Html;
const tempDirectory = require('temp-dir');
const tar = require('tar');
const path = require('path');
const { writeFile } = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const fs = require('fs');
const { getRepos } = require('../utils/helmRepos');

const writeFilePromise = promisify(writeFile);

function downloadFile(fileUrl, outputPath) {
  return fetch(fileUrl)
    .then((x) => x.arrayBuffer())
    .then((x) => writeFilePromise(outputPath, Buffer.from(x)));
}

const router = new Router();

async function getCharts(repoName) {
  const repos = await getRepos();
  const repository = repos.find((repo) => repo.name === repoName);
  const repoUrl = new URL(repository.url);
  if (repoUrl.pathname.charAt(repoUrl.pathname.length - 1) !== '/') {
    repoUrl.pathname = `${repoUrl.pathname}/index.yaml`;
  } else {
    repoUrl.pathname = `${repoUrl.pathname}index.yaml`;
  }
  return fetch(repoUrl.href)
    .then((fetchRes) => fetchRes.text().then(yaml.safeLoad));
}
async function createTempFolder() {
  return new Promise(((resolve, reject) => {
    fs.mkdtemp(path.join(tempDirectory, 'foo-'), (err, folder) => {
      if (err) reject(err);
      resolve(folder);
    });
  }));
}
async function diffFolders(folder1, folder2) {
  return new Promise((resolve, reject) => {
    exec(`git diff --no-index ${folder1} ${folder2}`,
      (error, stdout) => {
        resolve(stdout);
        if (error !== null) {
          reject(error);
        }
      });
  });
}
async function downloadChart(chart, tmpDir, repoUrl) {
  let chartUrl;
  try {
    chartUrl = new URL(chart.urls[0]);
  } catch (e) {
    if (repoUrl.charAt(repoUrl.length - 1) !== '/') {
      chartUrl = new URL(`${repoUrl}/${chart.urls[0]}`);
    } else {
      chartUrl = new URL(`${repoUrl}${chart.urls[0]}`);
    }
  }
  const fileName = chart.urls[0].split('/').pop();
  await downloadFile(chartUrl.href, `${tmpDir}/${fileName}`);
  fs.mkdirSync(`${tmpDir}/${chart.version}`);
  await tar.x({ file: `${tmpDir}/${fileName}`, cwd: `${tmpDir}/${chart.version}` });
}
async function diffChartTemplates(chart1, chart2, repoUrl) {
  const tmpDir = await createTempFolder();
  console.log(tmpDir);
  await downloadChart(chart1, tmpDir, repoUrl);
  await downloadChart(chart2, tmpDir, repoUrl);
  const diff = await diffFolders(`${tmpDir}/${chart1.version}`, `${tmpDir}/${chart2.version}`);
  const dirRegex = new RegExp(tmpDir, 'g');
  const diffPath = diff.replace(dirRegex, '');
  return diff2html.getPrettyHtml(diffPath);
}

router.get('/repos', async (ctx, next) => {
  const repos = await getRepos();
  await ctx.render('app/repos', { repos });
  next();
});


router.get('/repos/:repoName', async (ctx, next) => {
  const charts = await getCharts(ctx.params.repoName);
  await ctx.render('app/charts', { charts, repo: ctx.params.repoName });
  next();
});

router.get('/repos/:repoName/:chartName', async (ctx, next) => {
  const charts = await getCharts(ctx.params.repoName);
  const chartVersions = charts.entries[ctx.params.chartName];
  await ctx.render('app/chart', { chartVersions, repoName: ctx.params.repoName, chartName: ctx.params.chartName });
  next();
});
router.get('/repos/:repoName/:chartName/:versions', async (ctx, next) => {
  const charts = await getCharts(ctx.params.repoName);
  const repos = await getRepos();
  const repoUrl = repos.find((repo) => repo.name === ctx.params.repoName).url;
  const [version1, version2] = ctx.params.versions.split('...');
  const chartVersions = charts.entries[ctx.params.chartName];
  const chart1 = chartVersions.find((chart) => chart.version === version1);
  const chart2 = chartVersions.find((chart) => chart.version === version2);
  const diffHtml = await diffChartTemplates(chart1, chart2, repoUrl);
  await ctx.render('app/chartCompare', {
    chartVersions, repoName: ctx.params.repoName, chartName: ctx.params.chartName, diffHtml,
  });
  next();
});
module.exports = router;
