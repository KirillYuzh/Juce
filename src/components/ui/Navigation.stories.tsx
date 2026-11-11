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
    <div
      style={{
        width: 640,
        padding: 24,
        borderRadius: 24,
        background: 'var(--tb-white)',
        boxShadow: 'var(--tb-shadow-popover)',
      }}
    >
      <Accordion
        defaultOpenId="sources"
        items={[
          {
            id: 'sources',
            title: 'Откуда Джупсик берёт статьи?',
            content:
              'Из открытых каталогов препринтов и рецензируемых журналов; у каждого тезиса есть ссылка на источник.',
          },
          {
            id: 'limits',
            title: 'Есть ли лимит на запросы?',
            content: 'Учебные аккаунты — до 300 запросов в сутки, у лабораторий лимит выше.',
          },
          {
            id: 'export',
            title: 'Можно ли выгрузить обзор?',
            content: 'Да, в Markdown, DOCX и LaTeX — вместе со списком литературы.',
          },
        ]}
      />
    </div>
  ),
};
