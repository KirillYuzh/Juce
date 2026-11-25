import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const errors = [];
const buildHint = 'запустите npm run build:lib';

const fail = (message, hint) => errors.push(hint ? `${message} — ${hint}` : message);

if (!Array.isArray(pkg.files) || !pkg.files.includes('dist')) {
  fail('package.json: files должен содержать "dist"');
}

for (const rel of ['LICENSES', 'THIRD-PARTY-NOTICES.md']) {
  if (!Array.isArray(pkg.files) || !pkg.files.includes(rel)) {
    fail(`package.json: files должен содержать "${rel}"`);
  }
}

if (!existsSync(join(root, 'LICENSE'))) {
  fail('LICENSE: файл не найден в корне пакета', 'добавьте LICENSE в корень');
}

for (const rel of [
  'LICENSES/Manrope-OFL.txt',
  'LICENSES/JetBrainsMono-OFL.txt',
  'LICENSES/LinuxLibertine-OFL.txt',
  'LICENSES/GPL-2.0.txt',
  'LICENSES/LinuxLibertine-GPL-2.0-with-font-exception.txt',
  'THIRD-PARTY-NOTICES.md',
]) {
  if (!existsSync(join(root, rel))) {
    fail(`${rel}: файл не найден`, 'верните тексты лицензий шрифтов в репозиторий');
  }
}

for (const key of ['.', './styles.css', './reset.css']) {
  if (!pkg.exports || !Object.hasOwn(pkg.exports, key)) {
    fail(`package.json: exports должен содержать "${key}"`);
  }
}

const targets = new Set();
const collect = (value) => {
  if (typeof value === 'string') targets.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
};

for (const key of ['main', 'module', 'types']) {
  if (typeof pkg[key] === 'string') targets.add(pkg[key]);
}
if (pkg.exports) Object.values(pkg.exports).forEach(collect);

for (const target of targets) {
  if (!existsSync(resolve(root, target))) {
    fail(`package.json: ${target} не существует`, buildHint);
  }
}

for (const rel of ['juce-ui.js', 'juce-ui.css', 'reset.css', 'types/index.d.ts']) {
  if (!existsSync(join(dist, rel))) {
    fail(`dist/${rel} отсутствует`, buildHint);
  }
}

for (const rel of ['index.html', 'image.png', '.DS_Store']) {
  if (existsSync(join(dist, rel))) {
    fail(`dist/${rel} — признак демо-сборки, библиотека собирается только в dist`, buildHint);
  }
}

const assets = join(dist, 'assets');
if (existsSync(assets) && statSync(assets).isDirectory()) {
  const demoAssets = readdirSync(assets).filter((name) => /^index-.*\.js$/.test(name));
  if (demoAssets.length > 0) {
    fail(
      `dist/assets/${demoAssets[0]} — признак демо-сборки, библиотека собирается только в dist`,
      buildHint
    );
  }
}

const bundle = join(dist, 'juce-ui.js');
if (existsSync(bundle) && !readFileSync(bundle, 'utf8').trimStart().startsWith('"use client"')) {
  fail(
    'dist/juce-ui.js должен начинаться с "use client"',
    'проверьте rollupOptions.output.banner в vite.lib.config.ts и запустите npm run build:lib'
  );
}

const packageCss = join(dist, 'juce-ui.css');
if (existsSync(packageCss)) {
  const css = readFileSync(packageCss, 'utf8');
  const resets = [
    'a{color:inherit',
    'button,input,select,textarea{',
    'h1,h2,h3,h4,h5,h6,p{margin:0',
  ];
  if (/(^|[},])body\s*\{/.test(css) || resets.some((marker) => css.includes(marker))) {
    fail(
      'dist/juce-ui.css содержит глобальные ресеты документа',
      'ресеты публикуются только в dist/reset.css, уберите их из src/styles/index.css'
    );
  }
  if (/@media \(prefers-reduced-motion:reduce\)\{\s*\*/.test(css)) {
    fail(
      'dist/juce-ui.css гасит движение через глобальный * !important',
      'prefers-reduced-motion должен менять только токены --tb-duration-*'
    );
  }
  if (css.includes('scroll-behavior:auto!important')) {
    fail(
      'dist/juce-ui.css навязывает scroll-behavior хосту',
      'уберите scroll-behavior из motion.css'
    );
  }
}

const reset = join(dist, 'reset.css');
if (existsSync(reset)) {
  const css = readFileSync(reset, 'utf8');
  if (!/box-sizing:\s*border-box/.test(css) || !/(^|[},])\s*body\s*\{/.test(css)) {
    fail('dist/reset.css не похож на opt-in reset документа');
  }
}

const declarations = join(dist, 'types/index.d.ts');
if (existsSync(declarations)) {
  const source = readFileSync(declarations, 'utf8');
  if (/^\s*import\s+['"][^'"]+\.css['"]/m.test(source)) {
    fail(
      'dist/types/index.d.ts содержит side-effect импорт CSS',
      'запустите npm run build:lib (fix-declarations.mjs входит в неё)'
    );
  }
  const specifiers = Array.from(
    source.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)['"](\.{1,2}\/[^'"]+)['"]/g),
    (match) => match[1]
  );
  const extensionless = specifiers.filter((spec) => !/\.(js|cjs|mjs|json)$/.test(spec));
  if (extensionless.length > 0) {
    fail(
      `dist/types/index.d.ts: относительные импорты без .js — ${extensionless.join(', ')}`,
      'запустите npm run build:lib (fix-declarations.mjs входит в неё)'
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`check-pack: ${error}`);
  process.exit(1);
}

console.log('check-pack: упаковка пакета в порядке');
