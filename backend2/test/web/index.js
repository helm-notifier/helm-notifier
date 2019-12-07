const {expect} = require('chai');
require('../global');

describe('smoketests', () => {
  it('should redirect to correct locale', async () => {
    const res = await global.web.get('/');
    expect(res.status).to.eq(200);
    expect(res.url).to.contain('/en');
  });
});

// test('returns Spanish homepage', async t => {
//   const res = await global.web.get('/es', { headers: { Accept: 'text/html' } });
//
//   t.snapshot(res.text);
// });
//
// test('returns English ToS', async t => {
//   const res = await global.web.get('/en/terms', {
//     headers: { Accept: 'text/html' }
//   });
//
//   t.snapshot(res.text);
// });
//
// test('returns Spanish ToS', async t => {
//   const res = await global.web.get('/es/terms', {
//     headers: { Accept: 'text/html' }
//   });
//
//   t.snapshot(res.text);
// });
