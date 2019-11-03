const apm = require('elastic-apm-node').start({
  serviceName: 'helm-notifier',
  secretToken: process.env.ELASTIC_SECRET,
  serverUrl: process.env.ELASTIC_URL,
  asyncHooks: false,
});

module.exports = apm;
