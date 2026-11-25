import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join('node_modules', '.cache', 'vitest-report.json');
const baselinePath = path.join('tools', 'test-baseline.json');
const update = process.argv.includes('--update');
const force = process.argv.includes('--force');

function testFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return testFiles(full);
    return /\.test\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

// Убирает комментарии и строки, чтобы expect( в тексте-описании не считался проверкой.
function codeOnly(source) {
  let out = '';
  let index = 0;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') index += 1;
      continue;
    }

    if (char === '/' && next === '*') {
      index += 2;
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        index += 1;
      }
      index += 2;
      continue;
    }

    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      index += 1;
      while (index < source.length) {
        if (source[index] === '\\') {
          index += 2;
          continue;
        }
        if (source[index] === quote) {
          index += 1;
          break;
        }
        index += 1;
      }
      out += ' ';
      continue;
    }

    out += char;
    index += 1;
  }

  return out;
}

const assertions = testFiles('src').reduce(
  (total, file) =>
    total + (codeOnly(fs.readFileSync(file, 'utf8')).match(/expect\(/g) ?? []).length,
  0
);

fs.mkdirSync(path.dirname(reportPath), { recursive: true });

try {
  execFileSync(
    path.join('node_modules', '.bin', 'vitest'),
    ['run', '--reporter=json', `--outputFile=${reportPath}`],
    { stdio: 'inherit' }
  );
} catch {
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (report.numPendingTests > 0 || report.numTodoTests > 0) {
  console.error(
    `✗ пропущено тестов: ${report.numPendingTests}, todo: ${report.numTodoTests}. ` +
      'Ослаблять тесты нельзя: исправь причину или удали тест вместе с кодом.'
  );
  process.exit(1);
}

const baseline = fs.existsSync(baselinePath)
  ? JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
  : null;

if (update) {
  const lowerTests = baseline !== null && report.numTotalTests < baseline.tests;
  const lowerAssertions = baseline !== null && assertions < baseline.assertions;

  if ((lowerTests || lowerAssertions) && !force) {
    console.error(
      `✗ --update понижает базу: ${report.numTotalTests}/${assertions} против ` +
        `${baseline.tests}/${baseline.assertions}. Понижение — осознанное решение: ` +
        'добавь --force, если тесты действительно удалены вместе с кодом.'
    );
    process.exit(1);
  }

  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify({ tests: report.numTotalTests, assertions }, null, 2)}\n`
  );
  console.log(`✓ базовая линия: ${report.numTotalTests} тестов, ${assertions} проверок`);
  process.exit(0);
}

if (
  baseline !== null &&
  (report.numTotalTests < baseline.tests || assertions < baseline.assertions)
) {
  console.error(
    `✗ тестов/проверок стало меньше: ${report.numTotalTests}/${assertions} ` +
      `против ${baseline.tests}/${baseline.assertions}. Тесты не удаляют и не ослабляют — чинят причину.`
  );
  process.exit(1);
}

const minimum = baseline ?? { tests: report.numTotalTests, assertions };

console.log(
  `✓ тесты: ${report.numTotalTests} (минимум ${minimum.tests}), проверок ${assertions} (минимум ${minimum.assertions})`
);
