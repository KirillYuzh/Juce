import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';
import { homeNav } from '../../data/home';

const meta = {
  title: 'Blocks/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { nav: homeNav },
};
