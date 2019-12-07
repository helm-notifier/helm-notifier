/* global describe it before */
const {expect} = require('chai');
const { Users } = require('../../app/models');
require('../global');

describe('v1', () => {
  before(async () => {
    await Users.deleteOne({email: 'testglobal@api.example.com'});
  });
  it('fails when no creds are presented', async () => {
    const res = await global.api.get('/v1/account');
    expect(res.status).to.equal(401);
  });
  it('returns current user\'s account', async () => {
    const body = {
      email: 'testglobal@api.example.com',
      password: 'FKOZa3kP0TxSCA'
    };
    let res = await global.api.post('/v1/account', {body});
    expect(res.status).to.equal(200);
    res = await global.api.get('/v1/account', {
      headers: {
        Authorization: `Basic ${Buffer.from(`${res.body.api_token}:`).toString(
          'base64'
        )}`
      }
    });
    expect(res.status).to.equal(200);
  });
});
