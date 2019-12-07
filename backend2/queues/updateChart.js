const { chart, chartVersion } = require('../app/models');

module.exports = async (job) => {
  const [curChart, created] = await chart
    .findOrCreate({
      where: { name: job.data.chartName, repositoryId: job.data.repo.id },
    });

  const chartVersions = job.data.ChartData.map((version) => ({
    chartId: curChart.id,
    ...version,
  }));
  try {
    chartVersion.bulkCreate(chartVersions);
  } catch (e) {
    if (e.name !== 'SequelizeUniqueConstraintError') {
      throw e;
    }
  }

  return Promise.resolve();
};
