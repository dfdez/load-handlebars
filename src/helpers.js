import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import Handlebars from 'handlebars';
import { loadFiles } from './utils.js';
import { registerHelper } from './utils.js';

/**
 * @typedef {function({ file: string, extname: string, fileName: string }): void} FileCallback
 */

const HELPER_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

/**
 * Load and register Handlebars helpers from the filesystem.
 *
 * Resolves the glob pattern, dynamically imports every matched file, and
 * registers the exported value as one or more helpers.
 *
 * Each helper file may export:
 * - **A default export (function)** — registered under the file's basename.
 * - **A default export (plain object)** — each function-valued key is registered.
 * - **Named exports** — each exported function is registered under its own name.
 *
 * @param {string}       helpersPath  - Glob pattern for helper files.
 * @param {object}       [handlebars] - Handlebars instance. Defaults to the bundled one.
 * @param {FileCallback} [callback]   - Called after each helper file is registered.
 * @returns {Promise<object>} The Handlebars instance.
 *
 * @throws {TypeError} If `helpersPath` is not a string.
 * @throws {TypeError} If `callback` is provided but is not a function.
 * @throws {Error}     If a matched file cannot be imported.
 */
export const loadHelpers = async (helpersPath, handlebars = Handlebars, callback) => {
  if (typeof helpersPath !== 'string') {
    throw new TypeError(`loadHelpers: helpersPath must be a string, got ${typeof helpersPath}`);
  }
  if (callback !== undefined && typeof callback !== 'function') {
    throw new TypeError(`loadHelpers: callback must be a function, got ${typeof callback}`);
  }

  const onFile = callback ?? (() => {});

  await loadFiles(helpersPath, async ({ file, extname, fileName }) => {
    if (!HELPER_EXTENSIONS.has(extname)) return;

    let mod;
    try {
      mod = await import(pathToFileURL(resolve(file)).href);
    } catch (err) {
      throw new Error(`Failed to load helper at ${file}: ${err.message}`);
    }

    // Prefer the default export; fall back to the module namespace for named exports.
    const helper = mod.default ?? mod;
    registerHelper(fileName, helper, handlebars);
    onFile({ file, extname, fileName });
  });

  return handlebars;
};
