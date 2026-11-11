import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sources } from './Sources';

const meta: Meta = {
  title: 'AI/Sources',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const sources = [
  { url: 'https://www.tbank.ru/debit/', title: 'Дебетовые карты' },
  { url: 'https://www.tbank.ru/career/', title: 'Карьера в Т-Банке' },
  { url: 'https://www.tbank.ru/invest/' },
];

export const Collapsed: Story = {
  render: () => <div style={{ width: 420 }}><Sources sources={sources} /></div>,
};

export const Expanded: Story = {
  render: () => <div style={{ width: 420 }}><Sources sources={sources} defaultOpen /></div>,
};

export const Single: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Sources sources={[{ url: 'https://www.tbank.ru/invest/' }]} defaultOpen />
    </div>
  ),
};

export const Deduplicated: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Sources sources={[sources[0], sources[0], sources[0]]} defaultOpen />
    </div>
  ),
};
