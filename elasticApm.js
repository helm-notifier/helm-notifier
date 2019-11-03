const apm = require('elastic-apm-node').start({
  serviceName: 'helm-notifier',
  secretToken: process.env.ELASTIC_SECRET,
  serverUrl: process.env.ELASTIC_URL,
  asyncHooks: false,
  active: process.env.NODE_ENV === 'production',
});

module.exports = apm;
