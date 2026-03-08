import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';

import { loadPartials } from '../src/partials.js';
import { FIXTURES, PARTIALS, freshHbs } from './helpers.js';

describe('loadPartials', () => {
  test('throws TypeError when partialsPath is not a string', async () => {
    await assert.rejects(() => loadPartials(42), { name: 'TypeError' });
  });

  test('throws TypeError when callback is not a function', async () => {
    await assert.rejects(() => loadPartials(PARTIALS, freshHbs(), 'bad'), { name: 'TypeError' });
  });

  test('registers partials and returns the handlebars instance', async () => {
    const hbs = freshHbs();
    const result = await loadPartials(PARTIALS, hbs);
    assert.equal(result, hbs);
    assert.ok(hbs.partials['greeting'], 'greeting partial should be registered');
    assert.ok(hbs.partials['farewell'], 'farewell partial should be registered');
  });

  test('invokes the callback for each registered partial', async () => {
    const hbs = freshHbs();
    const registered = [];
    await loadPartials(PARTIALS, hbs, (entry) => registered.push(entry.fileName));
    assert.deepEqual(registered.sort(), ['farewell', 'greeting']);
  });

  test('renders a registered partial correctly', async () => {
    const hbs = freshHbs();
    await loadPartials(PARTIALS, hbs);
    const tmpl = hbs.compile('{{> greeting name="World"}}');
    assert.equal(tmpl({}).trim(), 'Hello, World!');
  });

  test('does nothing when the glob matches no files', async () => {
    const hbs = freshHbs();
    const result = await loadPartials(join(FIXTURES, 'partials', '*.xyz'), hbs);
    assert.equal(result, hbs);
    assert.deepEqual(Object.keys(hbs.partials), []);
  });
});
