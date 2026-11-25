import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ESLint } from 'eslint';

const binary = path.join('node_modules', '.bin', 'ast-grep');
const rulesDir = path.join('tools', 'rules');
const fixturesDir = path.join(rulesDir, 'fixtures');

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
    id: 'boundaries/dependencies',
    bad: {
      file: 'src/components/prebuilt/probe.tsx',
      code: "import { Header } from '../blocks/Header';\nexport const value = Header;\n",
    },
    good: {
      file: 'src/components/prebuilt/probe.tsx',
      code: "import { Card } from '../ui/Card';\nexport const value = Card;\n",
    },
  },
  {
    id: 'boundaries/dependencies',
    bad: {
      file: 'src/patterns/probe.tsx',
      code: "import { Header } from '../components/blocks/Header';\nexport const value = Header;\n",
    },
    good: {
      file: 'src/patterns/probe.tsx',
      code: "import { Button } from '../components/ui/Button';\nexport const value = Button;\n",
    },
  },
  {
    id: 'boundaries/dependencies',
    bad: {
      file: 'src/components/ui/probe.tsx',
      code: "import { HoloMosaic } from '../../patterns/using-other-libs/react-bits/HoloMosaic';\nexport const value = HoloMosaic;\n",
    },
    good: {
      file: 'src/components/ui/probe.tsx',
      code: "import { Button } from './Button';\nexport const value = Button;\n",
    },
  },
  {
    id: 'no-restricted-imports',
    bad: {
      file: 'src/components/ui/probe.tsx',
      code: "import '@antv/x6';\nexport const value = 1;\n",
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
  {
    id: 'no-restricted-syntax',
    bad: { file: 'src/lib/probe.test.ts', code: "describe.only('x', () => {});\n" },
    good: { file: 'src/lib/probe.test.ts', code: 'items.skip(2);\n' },
  },
];

let failed = 0;

function fail(message) {
  console.error(`✗ ${message}`);
  failed += 1;
}

function astGrepRules() {
  return fs
    .readdirSync(rulesDir)
    .filter((name) => name.endsWith('.yml'))
    .sort()
    .map((name) => {
      const source = fs.readFileSync(path.join(rulesDir, name), 'utf8');
      const match = source.match(/^id:\s*(\S+)\s*$/m);
      if (!match) throw new Error(`${name}: нет строки id`);
      return { id: match[1], file: name };
    });
}

function scan(id, file) {
  try {
    const output = execFileSync(
      binary,
      ['scan', '--config', 'sgconfig.yml', '--filter', `^${id}$`, '--error', file],
      { stdio: 'pipe', encoding: 'utf8' }
    );
    return { status: 0, output };
  } catch (error) {
    if (typeof error.status !== 'number') throw error;
    return { status: error.status, output: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
}

const ruleFiles = astGrepRules();
let astGrepCases = 0;

for (const rule of ruleFiles) {
  const directory = path.join(fixturesDir, rule.id);
  if (!fs.existsSync(directory)) {
    fail(`${rule.file}: нет фикстур ${path.join(directory, 'bad*')} и good*`);
    continue;
  }

  const files = fs.readdirSync(directory);
  const bad = files.filter((name) => name.startsWith('bad'));
  const good = files.filter((name) => name.startsWith('good'));

  if (bad.length === 0 || good.length === 0) {
    fail(`${rule.file}: нужен хотя бы один bad* и один good* в ${directory}`);
    continue;
  }

  for (const name of bad) {
    const file = path.join(directory, name);
    const { status, output } = scan(rule.id, file);
    if (status !== 1 || !output.includes(rule.id)) {
      fail(`${rule.id}: ожидалось нарушение с id правила в ${file}`);
    }
    astGrepCases += 1;
  }

  for (const name of good) {
    const file = path.join(directory, name);
    if (scan(rule.id, file).status !== 0) {
      fail(`${rule.id}: ожидалось чисто в ${file}`);
    }
    astGrepCases += 1;
  }
}

const eslint = new ESLint({ cwd: process.cwd() });

async function lint(ruleId, example) {
  const [result] = await eslint.lintText(example.code, { filePath: path.resolve(example.file) });
  return result.messages.some((message) => message.ruleId === ruleId);
}

for (const testCase of eslintCases) {
  if (!(await lint(testCase.id, testCase.bad))) {
    fail(`${testCase.id}: правило не сработало на нарушении ${testCase.bad.code.trim()}`);
  }
  if (await lint(testCase.id, testCase.good)) {
    fail(`${testCase.id}: правило сработало на корректном коде ${testCase.good.code.trim()}`);
  }
}

if (failed > 0) process.exit(1);

const total = astGrepCases + eslintCases.length;
console.log(
  `✓ правила: ${ruleFiles.length} правил ast-grep с фикстурами, ${total} проверок срабатывают на нарушении и молчат на корректном коде`
);
