import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src';
const THEME_FILES = new Set([
  'src/styles/tokens.css',
  'src/styles/themes-presets.css',
  'src/styles/structure.css',
  'src/styles/motion.css',
]);
const LITERAL_FILES = new Set(['src/styles/utilities.css']);
const VENDOR_CSS = [
  'src/patterns/using-other-libs/react-bits/Animations/',
  'src/patterns/using-other-libs/react-bits/Components/',
  'src/patterns/using-other-libs/react-bits/Micro/',
  'src/patterns/using-other-libs/react-bits/TextAnimations/',
  'src/patterns/using-other-libs/react-bits/backgrounds/',
  'src/patterns/using-other-libs/react-bits/HoloMosaic.css',
];
const HOVER_QUERY = /\(\s*hover\s*:\s*hover\s*\)/;
const HOVER_NEGATED = /\b(not|or)\b/i;
const SHADOW_PROP = /^box-shadow$/;
const COLOR_PROP =
  /^(color|background|background-color|background-image|border|border-color|border-top|border-right|border-bottom|border-left|outline|outline-color|fill|stroke|box-shadow)$/;
const PALETTE_VAR =
  /var\(\s*--(ink|mist|coral|bg|bg-2|bg-3|label|label-2|label-3|label-4|separator|gray|gray-[2-6]|accent|on-accent|link|link-hover|pink|red|orange|yellow|green|mint|teal|cyan|blue|indigo|purple|brown)\s*[,)]/;
const LENGTH_LITERAL = /\d(px|rem|em|%|vh|vw|ch|pt)\b/i;
const DURATION_LITERAL = /\d*\.?\d+m?s\b/i;
const EASE_LITERAL = /\b(ease|ease-in|ease-out|ease-in-out|linear|cubic-bezier)\b/i;
const ZERO_TIME = /\b0(?:\.0+)?m?s\b/gi;
const ZERO_STEP = /\b0(?:\.0+)?m?s\s+linear\b/gi;
const TRANSITION_ALL = /\ball\b/i;
const REDUCED_MOTION = /prefers-reduced-motion/;
const ANIMATION_PROP = /^animation(?:-duration|-timing-function)?$/;
const ANIMATION_EASE = /\b(ease|ease-in|ease-out|ease-in-out|cubic-bezier)\b/i;

// Стили заморожены: строки снимаются по мере правки компонентов, новые сюда не добавляются.
const KNOWN_ANIMATION_LITERALS = [];
const knownAnimation = new Set(
  KNOWN_ANIMATION_LITERALS.map(({ file, value }) => `${file}::${value}`)
);
const usedAnimation = new Set();

// Медиазапрос защищает :hover, только если (hover: hover) есть в каждой альтернативе списка.
function hoverGuarded(prelude) {
  if (!/^@media\b/i.test(prelude)) return false;
  return prelude
    .slice('@media'.length)
    .split(',')
    .every((query) => HOVER_QUERY.test(query) && !HOVER_NEGATED.test(query));
}

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

// Прячет содержимое строк и url(...), чтобы скобки внутри них не открывали блоки.
function maskLiterals(css) {
  const out = css.split('');
  const mask = (index) => {
    if (css[index] !== '\n') out[index] = ' ';
  };
  let quote = null;
  let urlDepth = 0;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];

    if (quote) {
      mask(index);
      if (char === '\\') {
        if (index + 1 < css.length) {
          mask(index + 1);
          index += 1;
        }
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      mask(index);
      continue;
    }

    if (urlDepth > 0) {
      if (char === '(') urlDepth += 1;
      else if (char === ')') urlDepth -= 1;
      mask(index);
      continue;
    }

    if (/^url\(/i.test(css.slice(index, index + 4))) {
      for (let offset = 0; offset < 4; offset += 1) mask(index + offset);
      index += 3;
      urlDepth = 1;
    }
  }

  return out.join('');
}

function blocks(masked, source) {
  const found = [];
  const stack = [];
  let start = 0;

  for (let index = 0; index < masked.length; index += 1) {
    const char = masked[index];
    if (char === '{') {
      const prelude = source.slice(start, index).trim().replace(/\s+/g, ' ');
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
          body: masked.slice(frame.bodyStart, index),
          line: masked.slice(0, frame.offset).split('\n').length,
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

function scopesFor(file) {
  const relative = file.split(path.sep).join('/');
  const vendor = VENDOR_CSS.some((prefix) => relative.startsWith(prefix));
  return {
    hover: !vendor,
    transition: !vendor && relative !== 'src/styles/motion.css',
    // В src/styles анимации служебные и scroll-driven (1ms linear), их литералы осознанны.
    animation:
      !vendor && (relative.startsWith('src/components/') || relative.startsWith('src/pages/')),
    reducedMotion:
      !vendor && relative !== 'src/styles/motion.css' && relative !== 'src/styles/utilities.css',
    theme: !vendor && !THEME_FILES.has(relative),
    literals:
      relative.startsWith('src/components/') ||
      relative.startsWith('src/pages/') ||
      LITERAL_FILES.has(relative),
  };
}

const FULL_SCOPE = {
  hover: true,
  transition: true,
  animation: true,
  reducedMotion: true,
  theme: true,
  literals: true,
};

export function analyze(file, scope = scopesFor(file)) {
  const source = blankComments(fs.readFileSync(file, 'utf8'));
  const masked = maskLiterals(source);
  const problems = [];

  for (const rule of blocks(masked, source)) {
    const isAtRule = rule.prelude.startsWith('@');

    if (scope.hover && !isAtRule && rule.prelude.includes(':hover')) {
      const guarded = rule.parents.some(hoverGuarded);
      if (!guarded) {
        problems.push(`${file}:${rule.line}: :hover вне @media (hover: hover) в «${rule.prelude}»`);
      }
    }

    if (scope.reducedMotion && isAtRule && REDUCED_MOTION.test(rule.prelude)) {
      problems.push(
        `${file}:${rule.line}: локальный prefers-reduced-motion в «${rule.prelude}», защита живёт только в src/styles/motion.css`
      );
    }

    if (scope.theme && !isAtRule && /\[data-theme/.test(rule.prelude)) {
      problems.push(
        `${file}:${rule.line}: компонент не может ветвиться по теме в «${rule.prelude}»`
      );
    }

    if (scope.theme && !isAtRule && /\[data-skin/.test(rule.prelude)) {
      problems.push(
        `${file}:${rule.line}: скинов нет: форма задаётся структурными ролями, убери [data-skin] в «${rule.prelude}»`
      );
    }

    if (isAtRule || rule.body.includes('{')) continue;

    for (const { property, value } of declarations(rule.body)) {
      if (scope.literals && property === 'border-radius') {
        const bare = stripFunctions(value);
        if (LENGTH_LITERAL.test(bare)) {
          problems.push(
            `${file}:${rule.line}: радиус задан числом «${value}», нужен токен --tb-radius-*`
          );
        }
      }

      if (scope.literals && COLOR_PROP.test(property)) {
        if (/#[0-9a-f]{3,8}\b/i.test(value) || /\b(rgba?|hsla?|oklch)\(/i.test(value)) {
          problems.push(
            `${file}:${rule.line}: цвет задан литералом «${property}: ${value}», нужен --tb-*`
          );
        }
      }

      if (scope.literals && PALETTE_VAR.test(value)) {
        problems.push(
          `${file}:${rule.line}: палитровая переменная в «${property}: ${value}», нужна --tb-* роль`
        );
      }

      if (
        scope.literals &&
        SHADOW_PROP.test(property) &&
        value !== 'none' &&
        !value.includes('var(--tb-')
      ) {
        problems.push(
          `${file}:${rule.line}: тень задана без токена «${value}», нужен --tb-shadow-*`
        );
      }

      if (scope.transition && property.startsWith('transition') && value !== 'none') {
        const bare = stripFunctions(value);

        if (TRANSITION_ALL.test(bare)) {
          problems.push(
            `${file}:${rule.line}: «${property}: ${value}» перечисляет все свойства, укажи меняющиеся явно`
          );
        }

        const timing = bare.replace(ZERO_TIME, '');

        if (DURATION_LITERAL.test(timing)) {
          problems.push(
            `${file}:${rule.line}: время задано литералом в «${property}: ${value}», возьми --tb-duration-fast|base|slow`
          );
        } else if (EASE_LITERAL.test(bare.replace(ZERO_STEP, ''))) {
          problems.push(
            `${file}:${rule.line}: кривая задана литералом в «${property}: ${value}», возьми --tb-ease-standard|out`
          );
        }
      }

      if (scope.animation && ANIMATION_PROP.test(property) && value !== 'none') {
        const bare = stripFunctions(value);
        const timing = bare.replace(ZERO_TIME, '');
        const message = DURATION_LITERAL.test(timing)
          ? `время анимации задано литералом в «${property}: ${value}», возьми --tb-duration-*`
          : ANIMATION_EASE.test(bare.replace(ZERO_STEP, ''))
            ? `кривая анимации задана литералом в «${property}: ${value}», возьми --tb-ease-*`
            : null;

        if (message) {
          const key = `${file}::${value}`;
          if (knownAnimation.has(key)) usedAnimation.add(key);
          else problems.push(`${file}:${rule.line}: ${message}`);
        }
      }
    }
  }

  return problems;
}

function selfTest() {
  const cases = [
    {
      name: 'hover',
      bad: 'bad.css',
      good: 'good.css',
      expect: ['hover вне @media (hover: hover)'],
    },
    {
      name: 'theme',
      bad: 'bad.css',
      good: 'good.css',
      expect: ['ветвиться по теме', 'скинов нет'],
    },
    {
      name: 'literal',
      bad: 'bad.css',
      good: 'good.css',
      expect: ['радиус задан числом', 'цвет задан литералом', 'тень задана без токена'],
    },
    {
      name: 'motion',
      bad: 'bad.css',
      good: 'good.css',
      expect: [
        'время задано литералом',
        'кривая задана литералом',
        'локальный prefers-reduced-motion',
        'перечисляет все свойства',
      ],
    },
    {
      name: 'animation',
      bad: 'bad.css',
      good: 'good.css',
      expect: ['время анимации задано литералом', 'кривая анимации задана литералом'],
    },
    {
      name: 'hover-composite',
      bad: 'bad.css',
      good: 'good.css',
      expect: ['hover вне @media (hover: hover)'],
    },
    { name: 'syntax', bad: 'bad.css', good: 'good.css', expect: ['радиус задан числом'] },
  ];
  let failed = 0;

  for (const testCase of cases) {
    const directory = path.join('tools', 'fixtures', 'css-check', testCase.name);
    const bad = analyze(path.join(directory, testCase.bad), FULL_SCOPE);
    const good = analyze(path.join(directory, testCase.good), FULL_SCOPE);
    const output = bad.join('\n');

    for (const expected of testCase.expect) {
      if (!output.includes(expected)) {
        console.error(`✗ ${testCase.name}: нет сообщения «${expected}» в ${testCase.bad}`);
        failed += 1;
      }
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
  const problems = cssFiles(ROOT).flatMap((file) => analyze(file));
  const stale = KNOWN_ANIMATION_LITERALS.filter(
    ({ file, value }) => !usedAnimation.has(`${file}::${value}`)
  );

  if (problems.length > 0 || stale.length > 0) {
    if (problems.length > 0) console.error(problems.join('\n'));
    for (const { file, value } of stale) {
      console.error(
        `✗ baseline устарел: ${file} «${value}» больше не нарушает — удали строку из KNOWN_ANIMATION_LITERALS`
      );
    }
    process.exit(1);
  }

  console.log(
    '✓ css: hover под указателем, тема только данными, радиусы и цвета только токенами, движение на токенах, защита движения в одном месте'
  );
}
