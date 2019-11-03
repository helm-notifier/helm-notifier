/* global describe it before */

let request = require('supertest');
const app = require('../server');
const reposTest = require('./fixtures/repos')
  .filter((repo) => repo.name !== 'zentainer');

describe('Routes', () => {
  before(async () => {
    await app();
    request = request('http://localhost:5000');
  });
  describe('GET /repos', () => {
    it('returns 200', async () => {
      await request
        .get('/repos')
        .expect(200);
    });
  });
  reposTest.forEach((test) => {
    it(`GET /repos/${test.name}`, async () => {
      await request
        .get(`/repos/${test.name}`)
        .expect(200);
    })
      .timeout(5000);
  });
});
