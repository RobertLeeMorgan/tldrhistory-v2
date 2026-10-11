const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('../frontend/node_modules/typescript');

const root = path.resolve(__dirname, '..');

// Execute the actual TS/TSX modules with existing TypeScript and Node's test
// runner. Only UI services and persistence are replaced; no API/DB is started.
function loadSource(relativePath, mocks = {}, cache = new Map(), sources = {}) {
  const filename = path.resolve(root, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  assert.notEqual(filename, path.join(root, 'backend/src/server/client.ts'),
    'Tests must never load the real database client');
  const module = { exports: {} };
  cache.set(filename, module);
  const localRequire = createRequire(filename);
  const code = ts.transpileModule(sources[relativePath] ?? fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const requireSource = (specifier) => {
    if (Object.hasOwn(mocks, specifier)) return mocks[specifier];
    if (specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(filename), specifier);
      for (const suffix of ['.ts', '.tsx']) {
        if (fs.existsSync(target + suffix)) {
          return loadSource(target + suffix, mocks, cache, sources);
        }
      }
    }
    return localRequire(specifier);
  };
  new Function('require', 'module', 'exports', code)(requireSource, module, module.exports);
  return module.exports;
}

module.exports = { loadSource };
