const util = require('util');
const {expect} = require('chai');
require('../global');
const phrases = require('../../config/phrases');
const {User, Contract} = require('../../app/models');
const bull = require('../../bull');
const faker = require('faker');

const wait = ms => new Promise(r => setTimeout(r, ms));

const retryOperation = (operation, delay, times) => new Promise((resolve, reject) => {
  return operation()
    .then(resolve)
    .catch((reason) => {
      if (times - 1 > 0) {
        return wait(delay)
          .then(retryOperation.bind(null, operation, delay, times - 1))
          .then(resolve)
          .catch(reject);
      }
      return reject(reason);
    });
});

function parseCookies(response) {
  const raw = response.headers.raw()['set-cookie'];
  return raw.map((entry) => {
    const parts = entry.split(';');
    const cookiePart = parts[0];
    return cookiePart;
  }).join(';');
}

describe('mail', () => {
  before(async () => {
    await retryOperation(() => global.web.get('/'), 1000, 5);
  });
  it('send mail', async () => {
    const res = await global.web.post('/en/register', {
      body: {
        email: 'pierre.humberdroz@prezero.com',
        password: '@!#SAL:DMA:SKLM!@',
        given_name: faker.name.firstName(),
        family_name: faker.name.lastName(),
      }
    });
  });
});
