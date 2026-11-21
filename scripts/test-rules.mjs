import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { ESLint } from 'eslint';

const astGrepCases = [
  { id: 'no-local-cx', bad: 'bad.ts', good: 'good.tsx' },
  { id: 'no-direct-clipboard', bad: 'bad.tsx', good: 'good.tsx' },
  { id: 'no-workaround-comment', bad: 'bad.ts', good: 'good.ts' },
  { id: 'no-workaround-comment-css', bad: 'bad.css', good: 'good.css' },
];

const eslintCases = [
  {
    id: 'boundaries/dependencies',
    bad: {
      file: 'src/components/ui/probe.tsx',
      code: "import { Header } from '../blocks/Header';\nexport const value = Header;\n",
    },
    good: {
      file: 'src/components/ui/probe.tsx',
      code: "import { Button } from './Button';\nexport const value = Button;\n",
    },
  },
  {
    id: '@typescript-eslint/no-explicit-any',
    bad: { file: 'src/lib/probe.ts', code: 'export const value: any = 1;\n' },
    good: { file: 'src/lib/probe.ts', code: 'export const value: unknown = 1;\n' },
  },
  {
    id: 'no-restricted-syntax',
    bad: { file: 'src/lib/probe.test.ts', code: "it.skip('x', () => {});\n" },
    good: { file: 'src/lib/probe.test.ts', code: "it('x', () => {});\n" },
  },
];

const binary = path.join('node_modules', '.bin', 'ast-grep');
let failed = 0;

function scan(id, file) {
  try {
    execFileSync(
      binary,
      ['scan', '--config', 'sgconfig.yml', '--filter', `^${id}$`, '--error', file],
      { stdio: 'pipe', encoding: 'utf8' }
    );
    return 0;
  } catch (error) {
    if (typeof error.status === 'number') return error.status;
    throw error;
  }
}

for (const testCase of astGrepCases) {
  const directory = path.join('tools', 'rules', 'fixtures', testCase.id);
  const bad = path.join(directory, testCase.bad);
  const good = path.join(directory, testCase.good);

  if (scan(testCase.id, bad) !== 1) {
    console.error(`✗ ${testCase.id}: ожидалось нарушение в ${bad}`);
    failed += 1;
  }
  if (scan(testCase.id, good) !== 0) {
    console.error(`✗ ${testCase.id}: ожидалось чисто в ${good}`);
    failed += 1;
  }
}

const eslint = new ESLint({ cwd: process.cwd() });

async function lint(ruleId, example) {
  const [result] = await eslint.lintText(example.code, { filePath: path.resolve(example.file) });
  return result.messages.some((message) => message.ruleId === ruleId);
}

for (const testCase of eslintCases) {
  if (!(await lint(testCase.id, testCase.bad))) {
    console.error(`✗ ${testCase.id}: правило не сработало на нарушении`);
    failed += 1;
  }
  if (await lint(testCase.id, testCase.good)) {
    console.error(`✗ ${testCase.id}: правило сработало на корректном коде`);
    failed += 1;
  }
}

if (failed > 0) process.exit(1);

const total = astGrepCases.length + eslintCases.length;
console.log(`✓ правила: ${total} срабатывают на нарушении и молчат на корректном коде`);
