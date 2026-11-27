import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shimmer } from './components/ui/Shimmer';

const meta: Meta = {
  title: 'Utilities/Effects',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const items = Array.from({ length: 30 }, (_, index) => `Строка ${index + 1}`);

const steps = ['Исследую источник 1', 'Исследую источник 2', 'Сверяю документацию'];

const shimmerSource = `const steps = ['Исследую источник 1', 'Исследую источник 2', 'Сверяю документацию'];

function ModelDrivenShimmer() {
  const [step, setStep] = useState(0);

  return (
    <>
      <Shimmer value={steps[step]} />
      <button type="button" onClick={() => setStep((current) => (current + 1) % steps.length)}>
        Следующий шаг
      </button>
    </>
  );
}

<Shimmer>Генерирую ответ…</Shimmer>

<Shimmer values={steps} interval={2000} />

<ModelDrivenShimmer />`;

function ModelDrivenShimmer() {
  const [step, setStep] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Shimmer value={steps[step]} style={{ font: '500 17px/24px var(--tb-font-text)' }} />
      <button
        type="button"
        style={{ font: '500 15px/24px var(--tb-font-text)', padding: '4px 12px' }}
        onClick={() => setStep((current) => (current + 1) % steps.length)}
      >
        Следующий шаг
      </button>
    </div>
  );
}

export const ScrollFadeUtilities: Story = {
  name: 'Scroll fade',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          width: 320,
          height: 260,
          borderRadius: 16,
          background: 'var(--tb-bg-secondary)',
          overflow: 'hidden',
        }}
      >
        <div
          className="tb-scroll-fade-y"
          style={{ height: '100%', padding: 16, fontSize: 15, lineHeight: '28px' }}
        >
          {items.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </div>
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
    </div>
  ),
};

export const ShimmerStory: Story = {
  name: 'Shimmer',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 420 }}>
      <Shimmer style={{ font: '500 17px/24px var(--tb-font-text)' }}>Генерирую ответ…</Shimmer>
      <Shimmer reverse style={{ font: '500 17px/24px var(--tb-font-text)' }}>
        Думаю над задачей…
      </Shimmer>
      <Shimmer duration="1s" angle="45deg" style={{ font: '500 17px/24px var(--tb-font-text)' }}>
        Быстрый вариант
      </Shimmer>
      <Shimmer active={false}>Без эффекта</Shimmer>
      <Shimmer
        values={steps}
        interval={2000}
        style={{ font: '500 17px/24px var(--tb-font-text)' }}
      />
      <ModelDrivenShimmer />
    </div>
  ),
  parameters: { docs: { source: { code: shimmerSource } } },
};
