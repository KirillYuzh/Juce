import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';

const meta: Meta = {
  title: 'Primitives/Hover card',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const link: CSSProperties = {
  font: '500 15px/24px var(--tb-font-text)',
  color: 'var(--tb-text-link)',
  textDecoration: 'underline',
  cursor: 'default',
};

const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const note: CSSProperties = { font: '600 14px/20px var(--tb-font-heading)' };

export const Default: Story = {
  render: () => (
    <p style={{ width: 320, margin: 0, font: '400 15px/24px var(--tb-font-text)' }}>
      Подробности — в{' '}
      <HoverCard delay={80}>
        <HoverCardTrigger>
          <span style={link} tabIndex={0}>
            тарифах
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <span style={card}>
            <strong style={note}>Дебетовая карта</strong>
            <span style={{ color: 'var(--tb-text-secondary)' }}>
              Бесплатное обслуживание при покупках от 10 000 ₽ в месяц.
            </span>
          </span>
        </HoverCardContent>
      </HoverCard>{' '}
      на сайте.
    </p>
  ),
};

export const AlwaysOpen: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <HoverCard defaultOpen>
        <HoverCardTrigger>
          <span style={link} tabIndex={0}>
            Наведите на меня
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <span style={card}>
            <strong style={note}>Подсказка</strong>
            <span style={{ color: 'var(--tb-text-secondary)' }}>
              Карточка открыта по умолчанию — удобно для скриншотов.
            </span>
          </span>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
