import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { loadHelpers } from '../src/helpers.js';
import { HELPERS, freshHbs } from './helpers.js';

describe('loadHelpers', () => {
  test('throws TypeError when helpersPath is not a string', async () => {
    await assert.rejects(() => loadHelpers(null), { name: 'TypeError' });
  });

  test('throws TypeError when callback is not a function', async () => {
    await assert.rejects(() => loadHelpers(HELPERS, freshHbs(), 123), { name: 'TypeError' });
  });

  test('registers helpers and returns the handlebars instance', async () => {
    const hbs = freshHbs();
    const result = await loadHelpers(HELPERS, hbs);
    assert.equal(result, hbs);
    assert.equal(typeof hbs.helpers['upper'], 'function');
    assert.equal(typeof hbs.helpers['repeat'], 'function');
    assert.equal(typeof hbs.helpers['shout'], 'function');
  });

  test('invokes the callback for each helper file', async () => {
    const hbs = freshHbs();
    const files = [];
    await loadHelpers(HELPERS, hbs, (entry) => files.push(entry.fileName));
    assert.deepEqual(files.sort(), ['upper', 'utils']);
  });

  test('helper registered from single-function export works correctly', async () => {
    const hbs = freshHbs();
    await loadHelpers(HELPERS, hbs);
    assert.equal(hbs.compile('{{upper val}}')({ val: 'hello' }), 'HELLO');
  });

  test('helpers registered from object export work correctly', async () => {
    const hbs = freshHbs();
    await loadHelpers(HELPERS, hbs);
    assert.equal(hbs.compile('{{repeat val 3}}')({ val: 'ab' }), 'ababab');
    assert.equal(hbs.compile('{{shout val}}')({ val: 'hi' }), 'HI!');
  });
});
