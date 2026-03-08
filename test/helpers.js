import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import Handlebars from 'handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const FIXTURES = join(__dirname, 'fixtures');
export const PARTIALS  = join(FIXTURES, 'partials', '*.hbs');
export const HELPERS   = join(FIXTURES, 'helpers', '*.js');
export const HOME_TPL  = join(FIXTURES, 'templates', 'home.hbs');

export const freshHbs = () => Handlebars.create();
