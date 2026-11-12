import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssistantPage } from './AssistantPage';
import { HomePage } from './HomePage';

const meta: Meta = {
  title: 'Templates/Pages',
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj;

export const Home: Story = {
  render: () => <HomePage />,
  parameters: { viewport: { defaultViewport: 'responsive' } },
};

export const Assistant: Story = {
  render: () => <AssistantPage />,
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
