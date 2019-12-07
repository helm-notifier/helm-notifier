const Frisbee = require('frisbee');
const _ = require('lodash');

const api = require('../api');
const web = require('../web');
const bull = require('../bull');
const config = require('../config');
const logger = require('../helpers/logger');
const models = require("../app/models");

global.web = {get: () => Promise.reject('Server not ready yet')};
global.api = {get: () => Promise.reject('Server not ready yet')};
(async () => {
  try {
    await models.sequelize.sync({force:true});
    await Promise.all([bull.start(), api.listen(), web.listen()]);

    global.api = new Frisbee({
      baseURI: `http://localhost:${api.server.address().port}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    global.web = new Frisbee({
      baseURI: `http://localhost:${web.server.address().port}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    logger.error(err);
  }
})();

