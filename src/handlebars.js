import Handlebars from 'handlebars';
import { loadPartials } from './partials.js';
import { loadHelpers } from './helpers.js';

/**
 * @typedef {Object} LoadHandlebarsConfig
 * @property {string}   [partials]          - Glob pattern for `.hbs` partial files.
 * @property {string}   [helpers]           - Glob pattern for helper files.
 * @property {function} [partialRegistered] - Called after each partial is registered.
 * @property {function} [helperRegistered]  - Called after each helper file is registered.
 */

/**
 * Load partials and helpers in a single call.
 *
 * Both `config.partials` and `config.helpers` are optional — omit either to skip that step.
 *
 * @param {LoadHandlebarsConfig} config
 * @param {object} [handlebars] - Handlebars instance. Defaults to the bundled one.
 * @returns {Promise<object>} The Handlebars instance.
 *
 * @throws {TypeError} If `config` is not a plain object.
 *
 * @example
 * const hbs = await loadHandlebars({
 *   partials: 'src/partials/**\/*.hbs',
 *   helpers:  'src/helpers/**\/*.js',
 * });
 */
export const loadHandlebars = async (config, handlebars = Handlebars) => {
  if (config === null || typeof config !== 'object' || Array.isArray(config)) {
    throw new TypeError(`loadHandlebars: config must be a plain object, got ${typeof config}`);
  }

  const { partials, partialRegistered, helpers, helperRegistered } = config;

  if (partials !== undefined) {
    await loadPartials(partials, handlebars, partialRegistered);
  }

  if (helpers !== undefined) {
    await loadHelpers(helpers, handlebars, helperRegistered);
  }

  return handlebars;
};
