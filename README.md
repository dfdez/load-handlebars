# load-handlebars

Load Handlebars partials and helpers from the filesystem using glob patterns.

## Why this package?

While **Native Handlebars** is a robust templating engine, it strictly handles string compilation and has no awareness of the filesystem. In a Node.js environment, registering multiple partials and helpers across directories requires tedious boilerplate: you have to manually read every file, extract names, and register them sequentially.

**`load-handlebars`** acts as an orchestrator for Handlebars in Node.js. It bridges the gap between the Handlebars engine and the filesystem by automating:
- **Partials**: Finds all `.hbs` files via glob patterns, reads them, and automatically registers them using the filename as the partial name.
- **Helpers**: Dynamically imports matched JavaScript files and registers exported functions as helpers.
- **Compilation**: Provides a convenience wrapper `compileFile` to read and compile a template from disk in a single step.

## Installation

```bash
npm install load-handlebars
```

## Usage

```js
import { loadHandlebars, compileFile } from 'load-handlebars';

const hbs = await loadHandlebars({
  partials: 'src/partials/**/*.hbs',
  helpers:  'src/helpers/**/*.js',
});

const render = await compileFile('src/views/home.hbs', hbs);
const html   = render({ title: 'Home' });
```

Call once at startup — not on every request.

## API

All functions are async and return the Handlebars instance (except `compileFile`, which returns a compiled template function).

### `loadHandlebars(config, handlebars?)`

| Option | Type | Description |
|---|---|---|
| `config.partials` | `string` | Glob pattern for `.hbs` partial files. |
| `config.helpers` | `string` | Glob pattern for helper files (`.js`, `.mjs`, `.cjs`). |
| `config.partialRegistered` | `function` | Called after each partial is registered. Receives `{ file, extname, fileName }`. |
| `config.helperRegistered` | `function` | Called after each helper file is registered. Receives `{ file, extname, fileName }`. |
| `handlebars` | `Handlebars` | Custom Handlebars instance. Defaults to the bundled one. |

### `loadPartials(partialsPath, handlebars?, callback?)`

Reads every `.hbs` file matched by the glob and registers it as a partial. The partial name is the basename without extension.

### `loadHelpers(helpersPath, handlebars?, callback?)`

Dynamically imports every matched file and registers the export as one or more helpers. See [Helper file format](#helper-file-format) below.

### `compileFile(filePath, handlebars?)`

Reads and compiles a single `.hbs` file. Returns a template function `(context) => string`.

## Requirements

- Node.js 18 or later

## License

MIT
