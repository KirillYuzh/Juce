import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs } from './Page';

const meta: Meta = {
  title: 'Primitives/Breadcrumbs',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Главная', href: '#/' },
        { label: 'Проекты', href: '#/projects' },
        { label: 'Вектор' },
      ]}
    />
  ),
};
