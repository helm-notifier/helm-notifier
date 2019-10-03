const fetch = require('node-fetch');
const yaml = require('js-yaml');

async function getRepos() {
  return fetch('https://raw.githubusercontent.com/helm/hub/master/repos.yaml')
    .then((fetchRes) => fetchRes.text().then(yaml.safeLoad).then((json) => json.repositories));
}

module.exports = {getRepos}
