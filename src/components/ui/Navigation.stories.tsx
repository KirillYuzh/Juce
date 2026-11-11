import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, Tabs } from './Navigation';

const meta: Meta = {
  title: 'Primitives/Navigation',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const SegmentedTabs: Story = {
  render: () => (
    <Tabs
      items={[
        { id: 'debit', label: 'Дебетовая карта' },
        { id: 'credit', label: 'Кредитная карта' },
        { id: 'deposit', label: 'Вклад' },
      ]}
    />
  ),
};

export const AccordionExample: Story = {
  render: () => (
    <div style={{ width: 640, padding: 24, borderRadius: 24, background: 'var(--tb-white)', boxShadow: 'var(--tb-shadow-popover)' }}>
      <Accordion
        defaultOpenId="cashback"
        items={[
          {
            id: 'cashback',
            title: 'Как начисляется кэшбэк?',
            content: 'Кэшбэк приходит рублями в течение 5 рабочих дней после закрытия расчётного периода.',
          },
          {
            id: 'limit',
            title: 'Есть ли лимит на переводы?',
            content: 'До 1 000 000 ₽ в месяц без комиссии клиентам Т-Банка.',
          },
          {
            id: 'delivery',
            title: 'Как получить карту?',
            content: 'Курьер привезёт карту в удобное время в пределах города доставки.',
          },
        ]}
      />
    </div>
  ),
};
