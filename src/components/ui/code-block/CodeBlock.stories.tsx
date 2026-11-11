import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockTitle,
  type CodeBlockLine,
} from './CodeBlock';

const meta: Meta = {
  title: 'Primitives/Code block',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 720, maxWidth: 'calc(100vw - 48px)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const parseAmount = `const parseAmount = (input: string) => {
  const value = Number(input.replace(/\\s/g, '').replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
};`;

const installCode = `npm install
npm run dev

> experimental@0.1.0 dev
> vite --port 5173`;

const startLineCode = `export function formatAmount(value: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(value);
}`;

const diffLines: CodeBlockLine[] = [
  { code: 'export function sum(values: number[]) {' },
  { code: '  return values.reduce((acc, value) => acc - value, 0);', variant: 'removed' },
  { code: '  return values.reduce((acc, value) => acc + value, 0);', variant: 'added' },
  { code: '}' },
];

const highlightLines: CodeBlockLine[] = [
  { code: 'const cache = new Map<string, number>();' },
  { code: 'const TTL = 60_000;', variant: 'highlighted' },
  { code: 'const key = name + ":" + id;' },
  { code: 'cache.set(key, Date.now() + TTL);' },
];

const longLine = `const message = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';`;

const terminalOutput = [
  '\u001b[32m➜\u001b[0m  \u001b[36mexperimental\u001b[0m \u001b[90mgit:(main)\u001b[0m npm run build',
  '',
  '\u001b[32mVITE v8.3.8\u001b[0m building for production...',
  '\u001b[32m✓\u001b[0m 128 modules transformed.',
  'dist/index.html                 \u001b[33m0.42 kB\u001b[0m │ gzip: 0.29 kB',
  'dist/assets/index-Bd9x.css      \u001b[33m8.71 kB\u001b[0m │ gzip: 2.14 kB',
  'dist/assets/index-C3na.js     \u001b[33m142.08 kB\u001b[0m │ gzip: 46.31 kB',
  '',
  '\u001b[90m  Done in 1.84s\u001b[0m',
].join('\n');

const errorOutput = `Error: Cannot find module './Button'
Require stack:
- /src/components/ui/code-block/CodeBlock.tsx
    at Module._resolveFilename (node:internal/modules/cjs/loader:1213:15)
    at Module._load (node:internal/modules/cjs/loader:1039:12)

Hint: check the import path — case matters on Linux.`;

const configCode = `{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true
  },
  "include": ["src", ".storybook"]
}`;

const longCode = `export interface Token {
  text: string;
  kind: 'plain' | 'keyword' | 'string';
}

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (char === ' ') {
      tokens.push({ text: char, kind: 'plain' });
      index += 1;
      continue;
    }

    if (char === '"') {
      let end = index + 1;
      while (end < source.length && source[end] !== '"') end += 1;
      tokens.push({ text: source.slice(index, end + 1), kind: 'string' });
      index = end + 1;
      continue;
    }

    tokens.push({ text: char, kind: 'plain' });
    index += 1;
  }

  return tokens;
}`;

export const Basic: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent language="ts">{parseAmount}</CodeBlockContent>
    </CodeBlock>
  ),
};

export const HeaderWithCopy: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>parse-amount.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={parseAmount} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="ts">{parseAmount}</CodeBlockContent>
    </CodeBlock>
  ),
};

export const LineNumbers: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent language="bash" lineNumbers>
        {installCode}
      </CodeBlockContent>
    </CodeBlock>
  ),
};

export const StartLine: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>format-amount.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={startLineCode} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="ts" lineNumbers startLine={12}>
        {startLineCode}
      </CodeBlockContent>
    </CodeBlock>
  ),
};

export const Diff: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>sum.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={diffLines.map((line) => line.code).join('\n')} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="ts" lineNumbers startLine={4}>
        {diffLines}
      </CodeBlockContent>
      <CodeBlockFooter>+1 строка, −1 строка</CodeBlockFooter>
    </CodeBlock>
  ),
};

export const Highlighted: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockContent language="ts" lineNumbers>
        {highlightLines}
      </CodeBlockContent>
    </CodeBlock>
  ),
};

export const Wrap: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>copy.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={longLine} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="ts" wrap>
        {longLine}
      </CodeBlockContent>
      <CodeBlockFooter>Перенос строк включён</CodeBlockFooter>
    </CodeBlock>
  ),
};

export const Terminal: Story = {
  render: () => (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>zsh — build</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={terminalOutput} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="ansi">{terminalOutput}</CodeBlockContent>
    </CodeBlock>
  ),
};

export const Destructive: Story = {
  render: () => (
    <CodeBlock variant="destructive">
      <CodeBlockHeader>
        <CodeBlockTitle>Ошибка сборки</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={errorOutput} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="text">{errorOutput}</CodeBlockContent>
    </CodeBlock>
  ),
};

export const Small: Story = {
  render: () => (
    <CodeBlock size="sm">
      <CodeBlockHeader>
        <CodeBlockTitle>tsconfig.json</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={configCode} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="json" lineNumbers>
        {configCode}
      </CodeBlockContent>
    </CodeBlock>
  ),
};

const SHOW_MORE_ID = 'code-block-show-more-content';

function ShowMoreDemo() {
  const [open, setOpen] = useState(false);

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>tokenize.ts</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={longCode} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent
        id={SHOW_MORE_ID}
        language="ts"
        lineNumbers
        style={{ maxHeight: open ? undefined : 120 }}
      >
        {longCode}
      </CodeBlockContent>
      <CodeBlockFooter>
        <span>{open ? `${longCode.split('\n').length} строк` : 'Показано начало файла'}</span>
        <Button
          size="s"
          variant="ghost"
          style={{ marginLeft: 'auto' }}
          aria-expanded={open}
          aria-controls={SHOW_MORE_ID}
          iconRight={open ? 'chevronUp' : 'chevronDown'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Свернуть' : 'Показать полностью'}
        </Button>
      </CodeBlockFooter>
    </CodeBlock>
  );
}

export const WithShowMore: Story = {
  render: () => <ShowMoreDemo />,
};
