import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from './Carousel';

const meta: Meta<typeof Carousel> = {
  title: 'Primitives/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Carousel>;

const slides = ['Java', 'Go', 'Линейная алгебра', 'Дискретка', 'ML'];

const card = (title: string, index: number) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 220,
      padding: 24,
      borderRadius: 24,
      background: index % 2 ? 'var(--tb-secondary)' : 'var(--tb-bg-secondary)',
    }}
  >
    <span style={{ font: '700 24px/28px var(--tb-font-heading)' }}>{title}</span>
    <span style={{ font: '400 15px/24px var(--tb-font-text)', color: 'var(--tb-text-secondary)' }}>
      Слайд {index + 1} из {slides.length}
    </span>
  </div>
);

export const Default: Story = {
  render: () => (
    <Carousel>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide}>{card(slide, index)}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
};

export const WithDots: Story = {
  name: 'Dots',
  render: () => (
    <Carousel>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide}>{card(slide, index)}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

export const Multiple: Story = {
  name: 'Half-width slides',
  render: () => (
    <Carousel opts={{ align: 'start' }}>
      <CarouselContent>
        {slides.map((slide, index) => (
          <CarouselItem key={slide} basis="calc(50% - 8px)">
            {card(slide, index)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: 300 }}>
      <Carousel orientation="vertical">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide}>{card(slide, index)}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  ),
};

function ApiDemo() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Carousel
        setApi={(next) => {
          setApi(next);
          setCurrent(next.selectedScrollSnap() + 1);
          next.on('select', () => setCurrent(next.selectedScrollSnap() + 1));
        }}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide}>{card(slide, index)}</CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button type="button" onClick={() => api?.scrollPrev()}>
          ←
        </button>
        <span style={{ font: '400 13px/20px var(--tb-font-text)' }}>
          Слайд {current} из {api?.scrollSnapList().length ?? 0}
        </span>
        <button type="button" onClick={() => api?.scrollNext()}>
          →
        </button>
      </div>
    </div>
  );
}

export const Api: Story = {
  name: 'setApi',
  render: () => <ApiDemo />,
};
