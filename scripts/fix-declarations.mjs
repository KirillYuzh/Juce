import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const typesDir = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL('../dist/types', import.meta.url));

const withExtension = (file, spec) => {
  const target = resolve(dirname(file), spec);
  if (existsSync(`${target}.d.ts`)) return `${spec}.js`;
  if (existsSync(join(target, 'index.d.ts'))) return `${spec}/index.js`;
  return `${spec}.js`;
};

const fixFile = (file) => {
  const source = readFileSync(file, 'utf8');
  const withoutCss = source.replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*\n?/gm, '');
  const fixed = withoutCss.replace(
    /(\bfrom\s*|\bimport\s*\(?\s*)(['"])(\.{1,2}\/[^'"]+)\2/g,
    (match, prefix, quote, spec) => `${prefix}${quote}${withExtension(file, spec)}${quote}`
  );
  if (fixed !== source) writeFileSync(file, fixed);
  return fixed !== source;
};

const files = readdirSync(typesDir, { recursive: true })
  .filter((name) => typeof name === 'string' && name.endsWith('.d.ts'))
  .map((name) => join(typesDir, name));

let changed = 0;
for (const file of files) {
  if (fixFile(file)) changed += 1;
}

console.log(`fix-declarations: обновлено ${changed} из ${files.length} .d.ts`);
