// const test = require('ava');
const {expect} = require('chai');
require('../global');
const {Inquiries} = require('../../app/models');

describe('support', () => {
  before(async () => {
    await Inquiries.deleteMany({});
  });

  it('should create inquiry', async () => {
    const res = await global.web.post('/en/support', {
      body: {email: 'test@example.com', message: 'Test message!'}
    });
    expect(res.status).to.eq(200);
    expect(res.body.message)
      .to
      .eq('Your support request has been sent successfully.  You should hear from us soon.  Thank you!');
  });

  it('should fail creating inquiry if last inquiry was with within last 24 hours (HTML)', async () => {
    await global.web.post('/en/support', {
      body: {email: 'test2@example.com', message: 'Test message!'}
    });

    const res = await global.web.post('/en/support', {
      body: {
        email: 'test2@example.com',
        message: 'Test message!'
      },
      headers: {
        Accept: 'text/html'
      }
    });
    const text = await res.text();
    expect(res.status).to.eq(400);
    expect(text).to.contain('You have reached the limit for sending support requests.  Please try again.')
  });

  it('should fail creating inquiry if last inquiry was with within last 24 hours (JSON)', async () => {
    await global.web.post('/en/support', {
      body: {
        email: 'test3@example.com',
        message: 'Test message!'
      }
    });

    const res = await global.web.post('/en/support', {
      body: {
        email: 'test3@example.com',
        message: 'Test message!'
      }
    });

    expect(res.status).to.eq(400);
    expect(res.body.message)
      .to
      .eq('You have reached the limit for sending support requests.  Please try again.');
  });

});
