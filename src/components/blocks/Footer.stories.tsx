import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta: Meta = {
  title: 'Blocks/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: { variant: 'home' },
};

export const Career: Story = {
  args: { variant: 'career' },
};
