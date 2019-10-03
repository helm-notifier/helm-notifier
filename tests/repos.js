/* global describe it before */
const { expect } = require('chai');
let request = require('supertest');
const app = require('../server');
const repos = require('./fixtures/repos').filter((repo) => repo.name !== 'zentainer');

describe('Routes', () => {
  before(async () => {
    app();
    request = request('http://localhost:5000');
  });
  describe('GET /repos', () => {
    it('returns 200', async () => {
      await request
        .get('/repos')
        .expect(200);
    });
  });
  repos.forEach((test) => {
    it(`GET /repos/${test.name}`, async () => {
      await request
        .get(`/repos/${test.name}`)
        .expect(200);
    }).timeout(5000);
  });
});
