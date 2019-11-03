/* global describe it before after */
let request = require('supertest');
const { expect } = require('chai');
const _ = require('lodash');
const app = require('../server');
const knex = require('../db');
const chartModel = require('../models/helmCharts.model');
const chartVersionModel = require('../models/helmChartVersions.model');
const repoModel = require('../models/helmRepos.model');
const cronjobs = require('../utils/cronjobs');

async function updateRepoData() {
  await cronjobs.updateRepos();
  const repo = await repoModel.getRepo('stable');
  await cronjobs.updateCharts(repo);
  return Promise.resolve();
}

describe('Subscriber flow', () => {
  let chart;
  before(async function () {
    this.timeout(300000);
    await updateRepoData();
    await app();
    request = request.agent('http://localhost:5000');
  });
  after(async () => {
    await knex('users').where({ email: 'test@test.de' }).del();
  });
  describe('GET /auth/', () => {
    it('/register', async () => {
      await request
        .post('/auth/register')
        .type('form')
        .send({
          email: 'test@test.de',
          password: 'testPassword',
        })
        .then((response) => {
          expect(response.status).to.equal(302);
          expect(response.text).to.include('auth/login');
        });
    });
    it('/login', async () => {
      await request
        .post('/auth/login')
        .type('form')
        .send({
          email: 'test@test.de',
          password: 'testPassword',
        })
        .then((response) => {
          expect(response.status).to.equal(302);
          expect(response.text).to.include('/repos');
        });
    });
    it('/subscriptions/:source_type/:source_id', async () => {
      const charts = await chartModel.listByRepoName('stable');
      chart = charts.find((ch) => ch.name === 'grafana');
      await request
        .get(`/subscriptions/chartVersionUpdate/${chart.id}`)
        .then((response) => {
          expect(response.status).to.equal(302);
          expect(response.text).to.include('/repos');
        });
    });
    it('generate Notification', async function () {
      this.timeout(3000000000);
      const versions = await chartVersionModel.findByChartId(chart.id);
      await knex('helm_chartVersions').where({ id: versions[0].id }).del();
      await updateRepoData();
    });
  });
});
