import type { Meta, StoryObj } from '@storybook/react-vite';
import { StackTrace } from './StackTrace';

const meta: Meta = {
  title: 'AI/Stack trace',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const stack = `TypeError: rates is not a function
    at calculateCashback (src/lib/rates.ts:42:18)
    at applyPromo (src/features/promo/index.ts:17:5)
    at Object.render (node_modules/react-dom/cjs/react-dom.production.js:1204:14)
    at process (src/main.tsx:9:3)`;

export const Collapsed: Story = {
  render: () => <div style={{ width: 520 }}><StackTrace stack={stack} /></div>,
};

export const Expanded: Story = {
  render: () => <div style={{ width: 520 }}><StackTrace stack={stack} defaultOpen /></div>,
};

export const ClickableFrames: Story = {
  render: () => (
    <div style={{ width: 520 }}>
      <StackTrace
        stack={stack}
        defaultOpen
        title="Упало на парсинге"
        onFilePathClick={(path, line, column) => console.log('open', path, line, column)}
      />
    </div>
  ),
};
