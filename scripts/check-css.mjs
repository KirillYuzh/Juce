import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src/components', 'src/sections', 'src/pages'];
const HOVER_MEDIA = /^@media\s*\(\s*hover\s*:\s*hover\s*\)/;
const SHADOW_PROP = /^box-shadow$/;
const COLOR_PROP =
  /^(color|background|background-color|background-image|border|border-color|border-top|border-right|border-bottom|border-left|outline|outline-color|fill|stroke|box-shadow)$/;
const PALETTE_VAR =
  /var\(\s*--(ink|mist|coral|bg|bg-2|bg-3|label|label-2|label-3|label-4|separator|gray|gray-[2-6]|accent|on-accent|link|link-hover|pink|red|orange|yellow|green|mint|teal|cyan|blue|indigo|purple|brown)\s*[,)]/;

function cssFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return cssFiles(full);
    return entry.name.endsWith('.css') ? [full] : [];
  });
}

function blankComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

function rules(css) {
  const found = [];
  const stack = [];
  let start = 0;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    if (char === '{') {
      const prelude = css.slice(start, index).trim().replace(/\s+/g, ' ');
      stack.push({
        prelude,
        parents: stack.map((frame) => frame.prelude),
        bodyStart: index + 1,
        offset: start,
      });
      start = index + 1;
    } else if (char === '}') {
      const frame = stack.pop();
      if (frame) {
        found.push({
          ...frame,
          body: css.slice(frame.bodyStart, index),
          line: css.slice(0, frame.offset).split('\n').length,
        });
      }
      start = index + 1;
    } else if (char === ';') {
      start = index + 1;
    }
  }

  return found;
}

function declarations(body) {
  return body
    .split(';')
    .map((chunk) => {
      const colon = chunk.indexOf(':');
      if (colon === -1) return null;
      return { property: chunk.slice(0, colon).trim(), value: chunk.slice(colon + 1).trim() };
    })
    .filter(Boolean);
}

function stripFunctions(value) {
  let result = value;
  let previous = '';
  while (previous !== result) {
    previous = result;
    result = result.replace(/\b(?:var|calc|max|min|clamp)\([^()]*\)/g, '');
  }
  return result;
}

export function analyze(file) {
  const css = blankComments(fs.readFileSync(file, 'utf8'));
  const problems = [];

  for (const rule of rules(css)) {
    const isAtRule = rule.prelude.startsWith('@');

    if (!isAtRule && rule.prelude.includes(':hover')) {
      const guarded = rule.parents.some((parent) => HOVER_MEDIA.test(parent));
      if (!guarded) {
        problems.push(`${file}:${rule.line}: :hover вне @media (hover: hover) в «${rule.prelude}»`);
      }
    }

    if (!isAtRule && /\[data-(theme|skin)/.test(rule.prelude)) {
      problems.push(
        `${file}:${rule.line}: компонент не может ветвиться по теме в «${rule.prelude}»`
      );
    }

    if (isAtRule || rule.body.includes('{')) continue;

    for (const { property, value } of declarations(rule.body)) {
      if (property === 'border-radius') {
        const bare = stripFunctions(value);
        if (/\d(px|rem|em|%|vh|vw)/.test(bare)) {
          problems.push(
            `${file}:${rule.line}: радиус задан числом «${value}», нужен токен --tb-radius-*`
          );
        }
      }

      if (COLOR_PROP.test(property)) {
        if (/#[0-9a-f]{3,8}\b/i.test(value) || /\b(rgba?|hsla?|oklch)\(/i.test(value)) {
          problems.push(
            `${file}:${rule.line}: цвет задан литералом «${property}: ${value}», нужен --tb-*`
          );
        }
      }

      if (PALETTE_VAR.test(value)) {
        problems.push(
          `${file}:${rule.line}: палитровая переменная в «${property}: ${value}», нужна --tb-* роль`
        );
      }

      if (SHADOW_PROP.test(property) && value !== 'none' && !value.includes('var(--tb-')) {
        problems.push(
          `${file}:${rule.line}: тень задана без токена «${value}», нужен --tb-shadow-*`
        );
      }
    }
  }

  return problems;
}

function selfTest() {
  const cases = [
    { name: 'hover', bad: 'bad.css', good: 'good.css' },
    { name: 'theme', bad: 'bad.css', good: 'good.css' },
    { name: 'literal', bad: 'bad.css', good: 'good.css' },
  ];
  let failed = 0;

  for (const testCase of cases) {
    const directory = path.join('tools', 'fixtures', 'css-check', testCase.name);
    const bad = analyze(path.join(directory, testCase.bad));
    const good = analyze(path.join(directory, testCase.good));

    if (bad.length === 0) {
      console.error(`✗ ${testCase.name}: ожидалось нарушение в ${testCase.bad}`);
      failed += 1;
    }
    if (good.length > 0) {
      console.error(
        `✗ ${testCase.name}: ложное срабатывание в ${testCase.good}\n${good.join('\n')}`
      );
      failed += 1;
    }
  }

  if (failed > 0) process.exit(1);
  console.log(`✓ css-правила: ${cases.length} проверки срабатывают на нарушении`);
}

if (process.argv.includes('--test')) {
  selfTest();
} else {
  const problems = ROOTS.flatMap(cssFiles).flatMap(analyze);

  if (problems.length > 0) {
    console.error(problems.join('\n'));
    process.exit(1);
  }

  console.log('✓ css: hover под указателем, тема только данными, размеры только токенами');
}
