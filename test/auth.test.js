const test = require('node:test');
const assert = require('node:assert/strict');

const { generateTokens, setAuthCookies } = require('../src/utils/tokens');

test('generateTokens creates access and refresh tokens', () => {
  process.env.JWT_ACCESS_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';

  const tokens = generateTokens('user-123', 'student');

  assert.ok(tokens.accessToken);
  assert.ok(tokens.refreshToken);
  assert.notEqual(tokens.accessToken, tokens.refreshToken);
});

test('setAuthCookies writes httpOnly cookies', () => {
  const seen = [];
  const res = {
    cookie: (name, value, options) => {
      seen.push({ name, value, options });
    },
  };

  setAuthCookies(res, { accessToken: 'abc', refreshToken: 'def' });

  assert.equal(seen.length, 2);
  assert.deepEqual(seen.map((entry) => entry.name).sort(), ['accessToken', 'refreshToken']);
  assert.ok(seen.every((entry) => typeof entry.value === 'string'));
  assert.ok(seen.every((entry) => entry.options.httpOnly === true));
  assert.ok(seen.every((entry) => entry.options.sameSite === 'strict'));
});
