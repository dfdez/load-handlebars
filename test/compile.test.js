import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { compileFile } from '../src/compile.js';
import { HOME_TPL, freshHbs } from './helpers.js';

describe('compileFile', () => {
  test('throws TypeError when filePath is not a string', async () => {
    await assert.rejects(() => compileFile(42), { name: 'TypeError' });
  });

  test('throws Error when the file does not exist', async () => {
    await assert.rejects(() => compileFile('/nonexistent/path/file.hbs'), { name: 'Error' });
  });

  test('returns a compiled template function', async () => {
    const tmpl = await compileFile(HOME_TPL);
    assert.equal(typeof tmpl, 'function');
  });

  test('compiled template renders correctly', async () => {
    const tmpl = await compileFile(HOME_TPL);
    assert.equal(tmpl({ title: 'Welcome' }).trim(), '<h1>Welcome</h1>');
  });

  test('uses the provided handlebars instance', async () => {
    const hbs = freshHbs();
    const tmpl = await compileFile(HOME_TPL, hbs);
    assert.equal(typeof tmpl, 'function');
  });
});
