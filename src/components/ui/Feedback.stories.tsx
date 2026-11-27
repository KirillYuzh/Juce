import type { Meta, StoryObj } from '@storybook/react-vite';
import { CookieNotice, Tooltip } from './Feedback';
import { Button } from './Button';

const meta: Meta = {
  title: 'Primitives/Feedback',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Tooltips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, paddingBlock: 48 }}>
      <Tooltip text="Примеры запускаются на JDK 21">
        <Button variant="secondary" size="m">
          Наведите на меня
        </Button>
      </Tooltip>
    </div>
  ),
};

export const Cookie: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <div style={{ minHeight: '100vh' }}>
      <CookieNotice />
    </div>
  ),
};
