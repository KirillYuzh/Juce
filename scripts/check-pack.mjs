import { readFileSync, existsSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const errors = [];

if (!Array.isArray(pkg.files) || !pkg.files.includes('dist')) {
  errors.push('package.json: files должен содержать "dist"');
}

if (!existsSync(new URL('../LICENSE', import.meta.url))) {
  errors.push('LICENSE: файл не найден в корне пакета');
}

for (const key of ['.', './styles.css']) {
  if (!pkg.exports || !Object.hasOwn(pkg.exports, key)) {
    errors.push(`package.json: exports должен содержать "${key}"`);
  }
}

if (typeof pkg.types !== 'string' || !pkg.types.startsWith('./dist/types/')) {
  errors.push(`package.json: types должен указывать в dist/types, сейчас ${JSON.stringify(pkg.types)}`);
}

if (errors.length > 0) {
  for (const error of errors) console.error(`check-pack: ${error}`);
  process.exit(1);
}

console.log('check-pack: упаковка пакета в порядке');
