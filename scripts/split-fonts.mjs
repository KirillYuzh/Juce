import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cssPath = join(root, 'dist/juce-ui.css');
const css = readFileSync(cssPath, 'utf8');

const fail = (message) => {
  console.error(`split-fonts: ${message}`);
  process.exit(1);
};

const afterTrivia = (index) => {
  const ch = css[index];
  if (ch === '/' && css[index + 1] === '*') {
    const end = css.indexOf('*/', index + 2);
    if (end === -1) fail('незакрытый комментарий');
    return end + 2;
  }
  if (ch === '"' || ch === "'") {
    let cursor = index + 1;
    while (cursor < css.length && css[cursor] !== ch) cursor += css[cursor] === '\\' ? 2 : 1;
    if (cursor >= css.length) fail('незакрытая строка');
    return cursor + 1;
  }
  return index;
};

const closeBlock = (open) => {
  let depth = 0;
  for (let i = open; i < css.length; ) {
    const next = afterTrivia(i);
    if (next !== i) {
      i = next;
      continue;
    }
    if (css[i] === '{') depth += 1;
    else if (css[i] === '}' && --depth === 0) return i;
    i += 1;
  }
  fail('незакрытый блок @font-face');
};

const openBraceAfter = (index) => {
  let cursor = index + '@font-face'.length;
  for (;;) {
    const next = afterTrivia(cursor);
    if (next !== cursor) {
      cursor = next;
      continue;
    }
    if (/\s/.test(css[cursor] ?? '')) {
      cursor += 1;
      continue;
    }
    if (css[cursor] === '{') return cursor;
    fail('@font-face без блока');
  }
};

const ranges = [];
for (let i = 0, depth = 0; i < css.length; ) {
  const next = afterTrivia(i);
  if (next !== i) {
    i = next;
    continue;
  }
  if (css[i] === '{') {
    depth += 1;
    i += 1;
    continue;
  }
  if (css[i] === '}') {
    depth -= 1;
    i += 1;
    continue;
  }
  if (depth === 0 && css.startsWith('@font-face', i) && !/[\w-]/.test(css[i + 10] ?? '')) {
    const end = closeBlock(openBraceAfter(i));
    ranges.push([i, end + 1]);
    i = end + 1;
    continue;
  }
  i += 1;
}

if (ranges.length === 0) fail('в dist/juce-ui.css нет @font-face — шрифты не попали в сборку');

const pieces = [];
let cursor = 0;
for (const [start, end] of ranges) {
  pieces.push(css.slice(cursor, start));
  cursor = end;
}
pieces.push(css.slice(cursor));
const core = pieces.join('');

writeFileSync(join(root, 'dist/juce-ui-core.css'), core);
writeFileSync(
  join(root, 'dist/juce-ui-fonts.css'),
  `${ranges.map(([start, end]) => css.slice(start, end)).join('\n')}\n`
);

console.log(`split-fonts: ${ranges.length} @font-face → dist/juce-ui-fonts.css, остальное → dist/juce-ui-core.css`);
