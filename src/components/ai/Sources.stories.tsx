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
  { url: 'https://go.dev/', title: 'go.dev: документация' },
  { url: 'https://www.nature.com/', title: 'Nature' },
  { url: 'https://scholar.google.com/' },
];

export const Collapsed: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Sources sources={sources} />
    </div>
  ),
};

export const Expanded: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Sources sources={sources} defaultOpen />
    </div>
  ),
};

export const Single: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Sources sources={[{ url: 'https://scholar.google.com/' }]} defaultOpen />
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
