const path = require('path');

const queues = [
  {
    name: 'email',
    options: {
      attempts: 5,
    },
    processors: [
      {
        processor: path.join(__dirname, 'email.js'),
        concurrency: 10,
      },
    ],
  }, {
    name: 'updateRepositories',
    options: {
      defaultJobOptions: {
        repeat: {
          cron: '*/60 * * * *',
        },
      },
    },
    processors: [
      {
        processor: path.join(__dirname, 'updateRepositories.js'),
        concurrency: 1,
      },
    ],
  }, {
    name: 'triggerRepositoryUpdate',
    options: {
      defaultJobOptions: {
        repeat: {
          cron: '*/15 * * * *',
        },
      },
    },
    processors: [
      {
        processor: path.join(__dirname, 'triggerRepositoryUpdate.js'),
        concurrency: 1,
      },
    ],
  }, {
    name: 'updateRepository',
    options: {
      attempts: 1,
    },
    processors: [
      {
        processor: path.join(__dirname, 'updateRepository.js'),
        concurrency: 3,
      },
    ],
  }, {
    name: 'updateChart',
    options: {
      attempts: 1,
    },
    processors: [
      {
        processor: path.join(__dirname, 'updateChart.js'),
        concurrency: 3,
      },
    ],
  },
];


module.exports = queues;
