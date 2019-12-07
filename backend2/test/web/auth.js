const util = require('util');
const {expect} = require('chai');
require('../global');
const phrases = require('../../config/phrases');
const {User} = require('../../app/models');
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
describe('Authentication', () => {
  before(async () => {
    await retryOperation(() => global.web.get('/'), 1000, 5);
    await User.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    })
  });
  it('creates new user', async () => {
    const res = await global.web.post('/en/register', {
      body: {
        email: 'test@example.com',
        password: '@!#SAL:DMA:SKLM!@'
      }
    });

    expect(res.body.redirectTo).to.eq('/en/dashboard');
    expect(res.status).to.eq(200);
  });
  it('should fail to register with easy password', async () => {
    const res = await global.web.post('/en/register', {
      body: {
        email: 'test1@example.com',
        password: 'password'
      }
    });
    expect(res.body.message).to.eq(phrases.INVALID_PASSWORD_STRENGTH);
    expect(res.status).to.eq(400);
  });
  it('should fail to register with an invalid email', async () => {
    const res = await global.web.post('/en/register', {
      body: {
        email: 'test123',
        password: 'testpassword'
      }
    });
    expect(res.status).to.eq(400);
  });
  it('should should not leak used email', async () => {
    const email = 'test2@example.com';
    const password = '!@K#NLK!#NSADKMSAD:K';

    await global.web.post('/en/register', {
      body: {email, password}
    });

    const res = await global.web.post('/en/register', {
      body: {email, password: 'wrongpassword'}
    });
    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.PASSPORT_USER_EXISTS_ERROR);
  });
  it('should allows password reset for valid email (HTML)', async () => {
    const email = 'test3@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {
      body: {email, password}
    });

    const res = await global.web.post('/en/forgot-password', {
      headers: {Accept: 'text/html'},
      body: {email}
    });

    expect(res.status).to.eq(200);
  });
  it('should allows password reset for valid email (JSON)', async () => {
    const email = 'test4@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    const res = await global.web.post('/en/forgot-password', {body: {email}});

    expect(res.status).to.eq(200);
    expect(res.body.message).to.eq(phrases.PASSWORD_RESET_SENT);
  });
  it('should reset the password with valid email and token (HTML)', async () => {
    const email = 'test5@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({
      where: {email},
      attributes: ['reset_token']
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email, password},
      headers: {
        Accept: 'text/html'
      }
    });

    expect(res.status).to.eq(200);
  });
  it('should reset the password with valid email and token (JSON)', async () => {
    const email = 'test6@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({
      where: {email},
      attributes: ['reset_token']
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email, password}
    });

    expect(res.status).to.eq(200);
    expect(res.body.message).to.eq(phrases.RESET_PASSWORD);
  });
  it('should fail resetting password for non-existent user', async () => {
    const email = 'test7@example.com';
    const password = '!@K#NLK!#N';

    const res = await global.web.post('/en/reset-password/randomtoken', {
      body: {email, password}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_RESET_PASSWORD);
  });
  it('should fail resetting password with invalid reset_token', async () => {
    const email = 'test8@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const res = await global.web.post('/en/reset-password/wrongtoken', {
      body: {email, password}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_RESET_PASSWORD);
  });
  it('should fail resetting password with missing new password', async () => {
    const email = 'test9@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({
      where: {email},
      attributes: ['reset_token']
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_PASSWORD);
  });
  it('should fail resetting password with invalid email', async () => {
    const email = 'test10@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({
      where: {email},
      attributes: ['reset_token']
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email: 'wrongemail'}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_EMAIL);
  });
  it('should fail resetting password invalid email + reset_token match', async () => {
    const email = 'test11@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({where: {email}});

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email: 'wrongemail@example.com', password}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_RESET_PASSWORD);
  });
  it('should fail resetting password if new password is too weak', async () => {
    const email = 'test12@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const user = await User.findOne({where: {email}});

    if (!user) {
      throw new Error('User does not exist');
    }

    const res = await global.web.post(`/en/reset-password/${user.reset_token}`, {
      body: {email, password: 'password'}
    });

    expect(res.status).to.eq(400);
    expect(res.body.message).to.eq(phrases.INVALID_PASSWORD_STRENGTH);
  });
  it('should fail resetting password if was already tried in the last 30 minutes', async () => {
    const email = 'test13@example.com';
    const password = '!@K#NLK!#N';

    await global.web.post('/en/register', {body: {email, password}});

    await global.web.post('/en/forgot-password', {body: {email}});

    const res = await global.web.post('/en/forgot-password', {body: {email}});

    expect(res.status).to.eq(400);
    expect(res.body.message)
      .to
      .eq(util.format(phrases.PASSWORD_RESET_LIMIT, 'in 30 minutes'));
  });
});
