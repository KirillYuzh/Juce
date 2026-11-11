import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';
import { homeNav } from '../../data/home';
import { careerNav } from '../../data/career';

const meta: Meta = {
  title: 'Blocks/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {
  args: { nav: homeNav, variant: 'home' },
};

export const Career: Story = {
  args: { nav: careerNav, variant: 'career' },
};
