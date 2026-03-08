import { glob } from 'glob';
import { extname, basename } from 'node:path';

/**
 * @typedef {Object} LoadFilesEntry
 * @property {string} file     - Absolute or relative path to the matched file.
 * @property {string} extname  - File extension, e.g. ".hbs" or ".js".
 * @property {string} fileName - Base filename without extension.
 */

/**
 * Resolve a glob pattern and invoke `load` for every matched file.
 * Silently returns when the pattern matches zero files.
 *
 * @param {string} filesPath - Glob pattern to resolve.
 * @param {function(LoadFilesEntry): Promise<void>} load
 * @returns {Promise<void>}
 */
export const loadFiles = async (filesPath, load) => {
  if (typeof filesPath !== 'string') {
    throw new TypeError(`Expected a glob string, got ${typeof filesPath}`);
  }

  let files;
  try {
    files = await glob(filesPath);
  } catch (err) {
    throw new Error(`Failed to expand glob pattern "${filesPath}": ${err.message}`);
  }

  if (!files || files.length === 0) return;

  for (const file of files) {
    const ext      = extname(file);
    const fileName = basename(file, ext);
    await load({ file, extname: ext, fileName });
  }
};

/**
 * Register a single helper or a map of helpers with a Handlebars instance.
 * Silently ignores values that are neither functions nor plain objects.
 *
 * @param {string}          name       - Name used when the export is a single function.
 * @param {function|Object} helper     - The value exported by the helper file.
 * @param {object}          handlebars - The Handlebars instance.
 */
export const registerHelper = (name, helper, handlebars) => {
  if (typeof helper === 'function') {
    handlebars.registerHelper(name, helper);
    return;
  }

  if (helper !== null && typeof helper === 'object' && !Array.isArray(helper)) {
    for (const [helperName, helperFn] of Object.entries(helper)) {
      if (typeof helperFn === 'function') {
        handlebars.registerHelper(helperName, helperFn);
      }
    }
  }
};
