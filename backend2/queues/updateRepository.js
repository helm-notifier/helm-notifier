const { helm } = require('../helpers');
const bull = require('../bull');

module.exports = async (job) => {
  const charts = await helm.getCharts(job.data.repo.url);
  return Promise.all(Object.keys(charts).map((chartName) => bull.add('updateRepository', {
    repo: job.data.repo,
    chartName,
    chartData: charts[chartName],
  })));
};
