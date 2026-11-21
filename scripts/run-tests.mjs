import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const reportPath = path.join('node_modules', '.cache', 'vitest-report.json');
const baselinePath = path.join('tools', 'test-baseline.json');
const update = process.argv.includes('--update');

function testFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return testFiles(full);
    return /\.test\.(ts|tsx)$/.test(entry.name) ? [full] : [];
  });
}

const assertions = testFiles('src').reduce(
  (total, file) => total + (fs.readFileSync(file, 'utf8').match(/expect\(/g) ?? []).length,
  0,
);

fs.mkdirSync(path.dirname(reportPath), { recursive: true });

try {
  execFileSync(
    path.join('node_modules', '.bin', 'vitest'),
    ['run', '--reporter=json', `--outputFile=${reportPath}`],
    { stdio: 'inherit' },
  );
} catch {
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (report.numPendingTests > 0 || report.numTodoTests > 0) {
  console.error(
    `✗ пропущено тестов: ${report.numPendingTests}, todo: ${report.numTodoTests}. ` +
      'Ослаблять тесты нельзя: исправь причину или удали тест вместе с кодом.',
  );
  process.exit(1);
}

if (update) {
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify({ tests: report.numTotalTests, assertions }, null, 2)}\n`,
  );
  console.log(`✓ базовая линия: ${report.numTotalTests} тестов, ${assertions} проверок`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

if (report.numTotalTests < baseline.tests || assertions < baseline.assertions) {
  console.error(
    `✗ тестов/проверок стало меньше: ${report.numTotalTests}/${assertions} ` +
      `против ${baseline.tests}/${baseline.assertions}. Тесты не удаляют и не ослабляют — чинят причину.`,
  );
  process.exit(1);
}

console.log(
  `✓ тесты: ${report.numTotalTests} (минимум ${baseline.tests}), проверок ${assertions} (минимум ${baseline.assertions})`,
);
