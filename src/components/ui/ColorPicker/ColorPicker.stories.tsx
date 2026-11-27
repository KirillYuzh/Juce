import type { Meta, StoryObj } from '@storybook/react-vite';
import { ColorPicker } from './ColorPicker';

const meta: Meta = {
  title: 'Primitives/Color picker',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <ColorPicker defaultValue="#ff6574" hint="Свотч, стрелки на клавиатуре или HEX" />
    </div>
  ),
};
