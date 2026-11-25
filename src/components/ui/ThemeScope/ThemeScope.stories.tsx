import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { Badge, Chip, Progress } from '../Display';
import { Input, Switch, Textarea } from '../Fields';
import { Accordion } from '../Navigation';
import { ThemeScope } from './ThemeScope';

const page: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
  minHeight: '100vh',
};

const half: CSSProperties = {
  display: 'grid',
  alignContent: 'start',
  gap: 24,
  padding: 32,
  boxSizing: 'border-box',
};

const eyebrow: CSSProperties = {
  margin: 0,
  font: '500 13px/18px var(--tb-font-text)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--tb-text-secondary)',
};

const heading: CSSProperties = {
  margin: 0,
  font: '500 32px/40px var(--tb-font-heading)',
};

const row: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
};

const card: CSSProperties = {
  display: 'grid',
  gap: 16,
  padding: 24,
  background: 'var(--tb-surface)',
  border: '1px solid var(--tb-border)',
  borderRadius: 'var(--tb-radius-l)',
  boxShadow: 'var(--tb-shadow-card)',
};

const cardTitle: CSSProperties = {
  font: '500 17px/24px var(--tb-font-text)',
};

const text: CSSProperties = {
  margin: 0,
  font: '400 15px/24px var(--tb-font-text)',
  color: 'var(--tb-text-secondary)',
};

const control: CSSProperties = { borderRadius: 'var(--tb-radius-m)' };
const pill: CSSProperties = { borderRadius: 'var(--tb-radius-pill)' };

function Demo() {
  return (
    <>
      <article style={card}>
        <div style={{ ...row, justifyContent: 'space-between' }}>
          <strong style={cardTitle}>Карточка кандидата</strong>
          <Badge tone="accent">новое</Badge>
        </div>
        <p style={text}>Продуктовый дизайнер, 6 лет опыта, портфолио с кейсами платформ.</p>
        <Progress value={72} />
      </article>

      <div style={row}>
        <Button style={control}>Откликнуться</Button>
        <Button variant="outline" style={control}>
          Смотреть профиль
        </Button>
      </div>

      <Input placeholder="Имя" style={control} />
      <Textarea placeholder="Сопроводительное письмо" style={control} />

      <div style={row}>
        <Chip active style={pill}>
          React
        </Chip>
        <Chip variant="outline" style={pill}>
          TypeScript
        </Chip>
        <Chip style={pill}>Дизайн-системы</Chip>
      </div>

      <Switch label="Показывать профиль в поиске" defaultChecked />

      <Accordion
        items={[
          {
            id: 'terms',
            title: 'Что входит в разбор?',
            content: 'Созвон на 40 минут, конспект и план роста на три месяца.',
          },
        ]}
      />
    </>
  );
}

const meta = {
  title: 'Foundations/Theme scopes',
  component: ThemeScope,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ThemeScope>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoSkins: Story = {
  render: () => (
    <div style={page}>
      <ThemeScope as="section" theme="light">
        <div style={half}>
          <p style={eyebrow}>Светлая тема</p>
          <h2 style={heading}>Обычные компоненты</h2>
          <Demo />
        </div>
      </ThemeScope>
      <ThemeScope as="section" theme="light" skin="blueprint">
        <div style={half}>
          <p style={eyebrow}>Blueprint</p>
          <h2 style={heading}>Сетка и прямые углы</h2>
          <Demo />
        </div>
      </ThemeScope>
    </div>
  ),
};
