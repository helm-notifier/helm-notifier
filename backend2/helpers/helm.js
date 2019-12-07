const fetch = require('node-fetch');
const yaml = require('js-yaml');

async function getRepos() {
  return fetch('https://raw.githubusercontent.com/helm/hub/master/repos.yaml')
    .then((fetchRes) => fetchRes.text()
      .then(yaml.safeLoad)
      .then((json) => json.repositories));
}

async function getCharts(url) {
  let responseJson = {};
  const repoUrl = new URL(url);
  if (repoUrl.pathname.charAt(repoUrl.pathname.length - 1) !== '/') {
    repoUrl.pathname = `${repoUrl.pathname}/index.yaml`;
  } else {
    repoUrl.pathname = `${repoUrl.pathname}index.yaml`;
  }
  let response;
  try {
    response = await fetch(repoUrl.href);
  } catch (e) {
    return responseJson;
  }
  const responseText = await response.text();
  responseJson = await yaml.safeLoad(responseText);

  return responseJson.entries;
}

module.exports = {
  getRepos,
  getCharts,
};
