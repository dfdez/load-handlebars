import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';

/**
 * Read and compile a single Handlebars template file.
 *
 * @param {string} filePath     - Path to an `.hbs` template file.
 * @param {object} [handlebars] - Handlebars instance. Defaults to the bundled one.
 * @returns {Promise<function>} A compiled template function `(context, options?) => string`.
 *
 * @throws {TypeError} If `filePath` is not a string.
 * @throws {Error}     If the file cannot be read.
 */
export const compileFile = async (filePath, handlebars = Handlebars) => {
  if (typeof filePath !== 'string') {
    throw new TypeError(`compileFile: filePath must be a string, got ${typeof filePath}`);
  }

  let source;
  try {
    source = await readFile(filePath, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read template at ${filePath}: ${err.message}`);
  }

  return handlebars.compile(source);
};
