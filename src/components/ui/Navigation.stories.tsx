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
        { id: 'java', label: 'Java' },
        { id: 'go', label: 'Go' },
        { id: 'math', label: 'Математика' },
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
            title: 'Откуда Джупсик берёт примеры?',
            content:
              'Из документации JDK, pkg.go.dev и открытых репозиториев; у каждого утверждения есть ссылка на источник.',
          },
          {
            id: 'limits',
            title: 'Есть ли лимит на запросы?',
            content: 'Учебные аккаунты — до 300 запросов в сутки, у команд лимит выше.',
          },
          {
            id: 'export',
            title: 'Можно ли выгрузить разбор?',
            content: 'Да, в Markdown, Jupyter и LaTeX — вместе с примерами кода.',
          },
        ]}
      />
    </div>
  ),
};
