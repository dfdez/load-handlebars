import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { loadHandlebars } from '../src/handlebars.js';
import { PARTIALS, HELPERS, freshHbs } from './helpers.js';

describe('loadHandlebars', () => {
  test('throws TypeError when config is not a plain object', async () => {
    await assert.rejects(() => loadHandlebars('bad'), { name: 'TypeError' });
    await assert.rejects(() => loadHandlebars(null),  { name: 'TypeError' });
    await assert.rejects(() => loadHandlebars([]),    { name: 'TypeError' });
  });

  test('loads partials and helpers together', async () => {
    const hbs = freshHbs();
    const result = await loadHandlebars({ partials: PARTIALS, helpers: HELPERS }, hbs);
    assert.equal(result, hbs);
    assert.ok(hbs.partials['greeting']);
    assert.equal(typeof hbs.helpers['upper'], 'function');
  });

  test('invokes partialRegistered and helperRegistered callbacks', async () => {
    const hbs = freshHbs();
    const partialNames = [];
    const helperFiles  = [];
    await loadHandlebars(
      {
        partials:          PARTIALS,
        helpers:           HELPERS,
        partialRegistered: (e) => partialNames.push(e.fileName),
        helperRegistered:  (e) => helperFiles.push(e.fileName),
      },
      hbs,
    );
    assert.deepEqual(partialNames.sort(), ['farewell', 'greeting']);
    assert.deepEqual(helperFiles.sort(),  ['upper', 'utils']);
  });

  test('skips partials when config.partials is omitted', async () => {
    const hbs = freshHbs();
    await loadHandlebars({ helpers: HELPERS }, hbs);
    assert.deepEqual(Object.keys(hbs.partials), []);
    assert.equal(typeof hbs.helpers['upper'], 'function');
  });

  test('skips helpers when config.helpers is omitted', async () => {
    const hbs = freshHbs();
    await loadHandlebars({ partials: PARTIALS }, hbs);
    assert.ok(hbs.partials['greeting']);
    assert.equal(hbs.helpers['upper'], undefined);
  });

  test('works with an empty config', async () => {
    const hbs = freshHbs();
    await assert.doesNotReject(() => loadHandlebars({}, hbs));
  });
});
