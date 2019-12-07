/* global describe it */
const { expect } = require('chai');

const { json, emoji } = require('../../config/utilities');

describe('Utilities', () => {
  it('should return json with 2 Spaces', async () => {
    expect(json({ ok: 'hey' })).to.eq('{\n  "ok": "hey"\n}');
  });
  it('should return valid emoji or empty string', async () => {
    expect(emoji('cat')).to.eq('🐱');
    expect(emoji('invalid_emoji')).to.eq('');
  });
});
