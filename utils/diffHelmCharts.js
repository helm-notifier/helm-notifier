const fetch = require('node-fetch');
const diff2html = require('diff2html').Diff2Html;
const tempDirectory = require('temp-dir');
const tar = require('tar');
const path = require('path');
const { writeFile } = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const fs = require('fs');

const writeFilePromise = promisify(writeFile);

function downloadFile(fileUrl, outputPath) {
  return fetch(fileUrl)
    .then((x) => x.arrayBuffer())
    .then((x) => writeFilePromise(outputPath, Buffer.from(x)));
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
  const fileName = chart.urls[0].split('/')
    .pop();
  await downloadFile(chartUrl.href, `${tmpDir}/${fileName}`);
  fs.mkdirSync(`${tmpDir}/${chart.version}`);
  await tar.x({
    file: `${tmpDir}/${fileName}`,
    cwd: `${tmpDir}/${chart.version}`,
  });
  return `${tmpDir}/${chart.version}`;
}

async function diffChartTemplates(chart1, chart2, repoUrl) {
  const tmpDir = await createTempFolder();
  await Promise.all([
    downloadChart(chart1, tmpDir, repoUrl),
    downloadChart(chart2, tmpDir, repoUrl),
  ]);

  const diff = await diffFolders(`${tmpDir}/${chart1.version}`, `${tmpDir}/${chart2.version}`);
  const dirRegex = new RegExp(tmpDir, 'g');
  const diffPath = diff.replace(dirRegex, '');
  fs.rmdirSync(tmpDir, { recursive: true });
  return diff2html.getPrettyHtml(diffPath);
}

module.exports = { diffChartTemplates, downloadChart, createTempFolder };
