import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemePicker } from './ThemePicker';
import { ThemeProvider } from '../ThemeProvider';

const meta: Meta = {
  title: 'Primitives/Theme picker',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Named: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <ThemeProvider defaultTheme="light">
        <ThemePicker />
      </ThemeProvider>
    </div>
  ),
};

export const Dots: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <ThemeProvider defaultTheme="light">
        <ThemePicker variant="dots" />
      </ThemeProvider>
    </div>
  ),
};
