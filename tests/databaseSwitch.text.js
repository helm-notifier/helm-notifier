/* global describe it before */
const { expect } = require('chai');
const repos = require('./fixtures/repos').filter((repo) => repo.name !== 'zentainer');
const cronjobs = require('../utils/cronjobs');
const knex = require('../db');
const helmRepoModel = require('../models/helmRepos.model');

describe('CronJobs', () => {
  // eslint-disable-next-line func-names
  before(async function () {
    this.timeout(300000);
    // await knex.raw('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    await knex.migrate.latest();
    await cronjobs.updateRepos();
    await cronjobs.updateRepo();
  });
  describe('update Repos', () => {
    repos.forEach((test) => {
      it(`check if data exists in database ${test.name}`, async () => {
        const dbData = await helmRepoModel.getRepo(test.name);
        expect(dbData.url).to.eql(test.url);
        expect(dbData.name).to.eql(test.name);
      }).timeout(5000);
    });
  });
  describe('update Charts', () => {
    it('update Charts', async () => {
    });
  });
}).timeout(10000000);
