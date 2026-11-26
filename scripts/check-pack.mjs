import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const errors = [];
const buildHint = 'запустите npm run build:lib';

const fail = (message, hint) => errors.push(hint ? `${message} — ${hint}` : message);

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(2)} МБ`
    : `${Math.round(bytes / 1024)} КБ`;

if (!Array.isArray(pkg.files) || !pkg.files.includes('dist')) {
  fail('package.json: files должен содержать "dist"');
}

for (const rel of ['LICENSES', 'THIRD-PARTY-NOTICES.md']) {
  if (!Array.isArray(pkg.files) || !pkg.files.includes(rel)) {
    fail(`package.json: files должен содержать "${rel}"`);
  }
}

if (pkg.scripts?.prepublishOnly !== 'npm run check') {
  fail(
    'package.json: scripts.prepublishOnly должен запускать "npm run check"',
    'предпубликационная проверка не должна теряться'
  );
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
  'LICENSES/ReactBits-MIT-Commons-Clause.txt',
  'THIRD-PARTY-NOTICES.md',
]) {
  if (!existsSync(join(root, rel))) {
    fail(`${rel}: файл не найден`, 'верните тексты лицензий шрифтов в репозиторий');
  }
}

for (const key of ['.', './styles.css', './styles-core.css', './fonts.css', './reset.css']) {
  if (!pkg.exports || !Object.hasOwn(pkg.exports, key)) {
    fail(`package.json: exports должен содержать "${key}"`);
  }
}

for (const [key, value] of Object.entries(pkg.exports ?? {})) {
  if (typeof value !== 'object' || value === null) {
    fail(`package.json: exports["${key}"] должен быть объектом условий`);
    continue;
  }

  if (typeof value.default !== 'string') {
    fail(
      `package.json: exports["${key}"] без "default"`,
      'добавьте "default" с путём к этому же файлу'
    );
  }

  if (key === './package.json') {
    const extra = ['types', 'import'].filter((condition) => condition in value);
    if (extra.length > 0) {
      fail(
        `package.json: exports["./package.json"] — только "default", лишние ${extra.join(', ')}`
      );
    }
    continue;
  }

  if (key === '.' && (typeof value.types !== 'string' || typeof value.import !== 'string')) {
    fail('package.json: exports["."] должен содержать "types" и "import"');
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

for (const rel of [
  'juce-ui.js',
  'juce-ui.css',
  'juce-ui-core.css',
  'juce-ui-fonts.css',
  'reset.css',
  'types/index.d.ts',
]) {
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

const distFiles = existsSync(dist) ? walk(dist) : [];

const maps = distFiles.filter((file) => file.endsWith('.map'));
if (maps.length > 0) {
  fail(
    `dist/${relative(dist, maps[0])} — карта исходников в пакете без src`,
    'поставьте sourcemap: false в vite.lib.config.ts и пересоберите'
  );
}

const sizeBudget = 1.45 * 1024 * 1024;
const shipped = distFiles.filter((file) => !file.endsWith('.map'));
const shippedBytes = shipped.reduce((total, file) => total + statSync(file).size, 0);
if (shippedBytes > sizeBudget) {
  fail(
    `dist без .map занимает ${formatSize(shippedBytes)} при бюджете ${formatSize(sizeBudget)}`,
    'уберите лишнее из сборки или осознанно поднимите бюджет'
  );
} else {
  console.log(`check-pack: dist без .map — ${formatSize(shippedBytes)}`);
}

const viteConfigPath = join(root, 'vite.lib.config.ts');
const viteConfig = existsSync(viteConfigPath) ? readFileSync(viteConfigPath, 'utf8') : '';
const externalMatch = viteConfig.match(/external:\s*\[([^\]]*)\]/);

if (!externalMatch) {
  fail('vite.lib.config.ts: не найден rollupOptions.external', 'верните список external в конфиг');
} else {
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
  ]);
  const externals = Array.from(externalMatch[1].matchAll(/['"]([^'"]+)['"]/g), (match) => match[1]);

  for (const specifier of externals) {
    const name = specifier.startsWith('@')
      ? specifier.split('/').slice(0, 2).join('/')
      : specifier.split('/')[0];
    if (!declared.has(name)) {
      fail(
        `vite.lib.config.ts: external "${specifier}" не объявлен как зависимость`,
        `добавьте "${name}" в peerDependencies, dependencies или devDependencies`
      );
    }
  }
}

const fontFaceCount = (css) => (css.match(/@font-face/g) ?? []).length;

const checkFontUrls = (css, label) => {
  for (const face of css.matchAll(/@font-face\s*\{([^}]*)\}/g)) {
    for (const url of face[1].matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
      const target = url[2];
      if (/^(data:|https?:|\/\/)/.test(target)) continue;
      if (!existsSync(resolve(dist, target))) {
        fail(
          `${label}: @font-face ссылается на несуществующий ${target}`,
          'проверьте src/styles/fonts.css и сборку ассетов'
        );
      }
    }
  }
};

if (existsSync(packageCss)) {
  const css = readFileSync(packageCss, 'utf8');
  if (fontFaceCount(css) === 0) {
    fail('dist/juce-ui.css без @font-face', 'шрифты должны остаться в styles.css');
  }
  checkFontUrls(css, 'dist/juce-ui.css');
}

const coreCss = join(dist, 'juce-ui-core.css');
if (existsSync(coreCss) && fontFaceCount(readFileSync(coreCss, 'utf8')) > 0) {
  fail(
    'dist/juce-ui-core.css содержит @font-face',
    'запустите npm run build:lib (split-fonts.mjs)'
  );
}

const fontsCss = join(dist, 'juce-ui-fonts.css');
if (existsSync(fontsCss)) {
  const css = readFileSync(fontsCss, 'utf8');
  if (fontFaceCount(css) === 0) {
    fail('dist/juce-ui-fonts.css без @font-face', 'запустите npm run build:lib (split-fonts.mjs)');
  }
  checkFontUrls(css, 'dist/juce-ui-fonts.css');
}

const typesDir = join(dist, 'types');
if (existsSync(typesDir)) {
  for (const file of walk(typesDir).filter((name) => name.endsWith('.d.ts'))) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(
      /(?:\bfrom\s*|\bimport\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g
    )) {
      const specifier = match[1];
      const base = resolve(dirname(file), specifier);
      const candidates = [
        base,
        `${base}.d.ts`,
        base.replace(/\.[cm]?js$/, '.d.ts'),
        base.replace(/\.[cm]?js$/, '.ts'),
      ];
      if (!candidates.some((candidate) => existsSync(candidate))) {
        fail(
          `dist/types/${relative(typesDir, file)}: импорт "${specifier}" не разрешается в существующий файл`,
          buildHint
        );
      }
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`check-pack: ${error}`);
  process.exit(1);
}

console.log('check-pack: упаковка пакета в порядке');
