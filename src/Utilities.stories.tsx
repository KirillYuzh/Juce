import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Utilities/Effects',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const items = Array.from({ length: 30 }, (_, index) => `Строка ${index + 1}`);

export const ScrollFadeVertical: Story = {
  render: () => (
    <div
      className="tb-scroll-fade-y"
      style={{
        width: 320,
        height: 260,
        padding: 16,
        borderRadius: 16,
        background: 'var(--tb-bg-secondary)',
        fontSize: 15,
        lineHeight: '28px',
      }}
    >
      {items.map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  ),
};

export const ScrollFadeHorizontal: Story = {
  render: () => (
    <div
      className="tb-scroll-fade-x"
      style={{ display: 'flex', gap: 8, width: 420, paddingBlock: 8 }}
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          style={{
            flex: 'none',
            width: 120,
            height: 80,
            borderRadius: 12,
            background: 'var(--tb-secondary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '500 13px/18px var(--tb-font-text)',
          }}
        >
          Карточка {index + 1}
        </div>
      ))}
    </div>
  ),
};

export const Shimmer: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
      <p className="tb-shimmer" style={{ margin: 0, font: '500 17px/24px var(--tb-font-text)' }}>
        Генерирую ответ…
      </p>
      <p
        className="tb-shimmer tb-shimmer-reverse"
        style={{ margin: 0, font: '500 17px/24px var(--tb-font-text)' }}
      >
        Думаю над запросом…
      </p>
      <p
        className="tb-shimmer"
        style={{
          margin: 0,
          font: '500 17px/24px var(--tb-font-text)',
          ['--tb-shimmer-duration' as string]: '1s',
          ['--tb-shimmer-angle' as string]: '45deg',
        }}
      >
        Быстрый вариант
      </p>
      <p className="tb-shimmer tb-shimmer-none" style={{ margin: 0 }}>
        Без эффекта
      </p>
    </div>
  ),
};
