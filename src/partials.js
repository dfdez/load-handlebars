import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import { loadFiles } from './utils.js';

/**
 * @typedef {function({ file: string, extname: string, fileName: string }): void} FileCallback
 */

/**
 * Load and register Handlebars partials from the filesystem.
 *
 * Resolves the glob pattern, reads every matched `.hbs` file, and registers
 * it as a partial using the file's basename (without extension).
 *
 * @param {string}       partialsPath - Glob pattern for `.hbs` files.
 * @param {object}       [handlebars] - Handlebars instance. Defaults to the bundled one.
 * @param {FileCallback} [callback]   - Called after each partial is registered.
 * @returns {Promise<object>} The Handlebars instance.
 *
 * @throws {TypeError} If `partialsPath` is not a string.
 * @throws {TypeError} If `callback` is provided but is not a function.
 * @throws {Error}     If a matched file cannot be read.
 */
export const loadPartials = async (partialsPath, handlebars = Handlebars, callback) => {
  if (typeof partialsPath !== 'string') {
    throw new TypeError(`loadPartials: partialsPath must be a string, got ${typeof partialsPath}`);
  }
  if (callback !== undefined && typeof callback !== 'function') {
    throw new TypeError(`loadPartials: callback must be a function, got ${typeof callback}`);
  }

  const onFile = callback ?? (() => {});

  await loadFiles(partialsPath, async ({ file, extname, fileName }) => {
    if (extname !== '.hbs') return;

    let partial;
    try {
      partial = await readFile(file, 'utf8');
    } catch (err) {
      throw new Error(`Failed to load partial at ${file}: ${err.message}`);
    }

    handlebars.registerPartial(fileName, partial);
    onFile({ file, extname, fileName });
  });

  return handlebars;
};
