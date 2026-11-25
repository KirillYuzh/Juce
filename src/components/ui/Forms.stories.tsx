import { useState, type CSSProperties, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, ChipSelect, Input, Radio, Select, Switch, Textarea } from './Fields';

const meta: Meta = {
  title: 'Primitives/Forms',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const column = { display: 'flex', flexDirection: 'column' as const, gap: 16, width: 400 };

export const Inputs: Story = {
  render: () => (
    <div style={column}>
      <Input placeholder="Имя пользователя" required />
      <Input placeholder="Telegram" />
      <Input placeholder="Электронная почта" />
      <Input
        placeholder="Промокод курса"
        error="Такого промокода нет или он истёк"
        defaultValue="JUCE2026"
      />
    </div>
  ),
};

export const InputSizes: Story = {
  name: 'Input sizes',
  render: () => (
    <div style={column}>
      <Input size="l" placeholder="l — 56px" required />
      <Input size="m" placeholder="m — 44px" />
      <Input size="s" placeholder="s — 32px" />
    </div>
  ),
};

export const InsetRadius: Story = {
  name: 'Inset radius',
  render: () => (
    <div
      style={
        {
          '--tb-radius-parent': 'var(--tb-radius-l)',
          '--tb-radius-parent-padding': 'var(--tb-space-3)',
          width: 400,
          padding: 'var(--tb-space-3)',
          borderRadius: 'var(--tb-radius-l)',
          background: 'var(--tb-bg-secondary)',
        } as CSSProperties
      }
    >
      <Input size="s" radius="inset" placeholder="Радиус родителя минус его padding" />
    </div>
  ),
};

export const Textareas: Story = {
  render: () => (
    <div style={column}>
      <Textarea placeholder="Комментарий" />
    </div>
  ),
};

export const Selects: Story = {
  render: () => (
    <div style={column}>
      <Select
        aria-label="Язык разбора"
        options={[
          { value: 'all', label: 'Выберите язык (доступно четыре)' },
          { value: 'java', label: 'Java' },
          { value: 'go', label: 'Go' },
          { value: 'python', label: 'Python' },
        ]}
      />
      <Select
        aria-label="Формат объяснения"
        options={[
          { value: 'short', label: 'Кратко' },
          { value: 'deep', label: 'Подробно' },
          { value: 'code', label: 'С примерами кода' },
        ]}
      />
    </div>
  ),
};

const directions = [
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'math', label: 'Математика' },
  { value: 'algorithms', label: 'Алгоритмы' },
  { value: 'databases', label: 'Базы данных' },
  { value: 'frontend', label: 'Фронтенд' },
];

function ChipSelectDemo() {
  const [value, setValue] = useState(['go']);
  return (
    <div style={column}>
      <ChipSelect
        label="Направления"
        options={directions}
        value={value}
        onChange={setValue}
        hint="Можно выбрать несколько"
      />
    </div>
  );
}

export const MultipleChoice: Story = {
  name: 'Multiple choice',
  render: () => <ChipSelectDemo />,
  parameters: {
    docs: {
      source: {
        code: `<ChipSelect
  label="Направления"
  options={directions}
  value={value}
  onChange={setValue}
  hint="Можно выбрать несколько"
/>`,
      },
    },
  },
};

export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Присылать разборы по Java и Go" />
      <Checkbox label="Отмеченный пункт" defaultChecked />
      <Checkbox label="Недоступный пункт" disabled />
    </div>
  ),
};

export const Radios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Radio name="experience" label="Да" defaultChecked />
      <Radio name="experience" label="Нет" />
      <Radio name="experience" label="Недоступно" disabled />
    </div>
  ),
};

export const Switches: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="Уведомления о новых разборах" defaultChecked />
      <Switch label="Напоминания о дедлайнах" />
    </div>
  ),
};

const submit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

export const WholeForm: Story = {
  render: () => (
    <form style={{ ...column, gap: 12 }} onSubmit={submit}>
      <Input placeholder="Имя пользователя" required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Input placeholder="Telegram" required />
        <Input placeholder="Электронная почта" type="email" />
      </div>
      <Input placeholder="Дата старта курса" required />
      <Select
        aria-label="Язык разбора"
        options={[
          { value: 'all', label: 'Выберите язык (доступно четыре)' },
          { value: 'java', label: 'Java' },
        ]}
      />
      <Checkbox label="Соглашаюсь получать разборы задач и новости платформы" />
    </form>
  ),
};
