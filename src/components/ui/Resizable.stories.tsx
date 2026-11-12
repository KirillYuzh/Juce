import type { Meta, StoryObj } from '@storybook/react-vite';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';

const meta: Meta = {
  title: 'Primitives/Resizable',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const pane = (title: string, filled = false) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: 16,
      background: filled ? 'var(--tb-secondary)' : 'var(--tb-bg-secondary)',
      font: '500 14px/20px var(--tb-font-text)',
    }}
  >
    {title}
  </div>
);

const frame = { width: 640, height: 280, borderRadius: 16, overflow: 'hidden' } as const;

export const Horizontal: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={50}>{pane('Один')}</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>{pane('Два', true)}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Three: Story = {
  name: 'Three panels',
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          {pane('Разбор')}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          {pane('Код', true)}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          {pane('Вывод')}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={40}>{pane('Заголовок')}</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60}>{pane('Содержимое', true)}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Nested: Story = {
  name: 'Nested',
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={30}>{pane('Меню')}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={65}>{pane('Редактор', true)}</ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35}>{pane('Терминал')}</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
