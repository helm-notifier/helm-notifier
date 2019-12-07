const Bull = require('@ladjs/bull');
const Graceful = require('@ladjs/graceful');

const config = require('./config');
const queues = require('./queues');
const logger = require('./helpers/logger');

const bull = new Bull({
  logger,
  queues,
  queue: {
    prefix: `bull_${config.env}`,
  },
});

if (!module.parent) {
  const graceful = new Graceful({
    bulls: [bull],
    logger,
  });

  (async () => {
    try {
      await Promise.all([bull.start(), graceful.listen()]);
      await bull.add('updateRepositories');
      await bull.add('triggerRepositoryUpdate');
      if (process.send) process.send('ready');
      logger.info('Lad job scheduler started');
    } catch (err) {
      logger.error(err);
      process.exit(1);
    }
  })();
}

module.exports = bull;
