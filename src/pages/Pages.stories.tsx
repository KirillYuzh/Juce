import type { Meta, StoryObj } from '@storybook/react-vite';
import { HomePage } from './HomePage';
import { CareerPage } from './CareerPage';

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

export const Career: Story = {
  render: () => <CareerPage />,
  parameters: { viewport: { defaultViewport: 'responsive' } },
};
