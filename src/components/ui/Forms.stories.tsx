import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Input, Radio, Select, Switch, Textarea } from './Fields';

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
      <Input label="Имя пользователя" placeholder="Имя пользователя*" />
      <Input label="Telegram" placeholder="@username" />
      <Input label="Почта" placeholder="Электронная почта" hint="Пришлём доступ к репозиторию" />
      <Input
        label="Промокод курса"
        placeholder="Введите промокод"
        error="Такого промокода нет или он истёк"
        defaultValue="JUCE2026"
      />
    </div>
  ),
};

export const Textareas: Story = {
  render: () => (
    <div style={column}>
      <Textarea label="Комментарий" placeholder="Какую задачу разбираете?" />
    </div>
  ),
};

export const Selects: Story = {
  render: () => (
    <div style={column}>
      <Select
        label="Язык разбора"
        options={[
          { value: 'all', label: 'Выберите язык (доступно четыре)' },
          { value: 'java', label: 'Java' },
          { value: 'go', label: 'Go' },
          { value: 'python', label: 'Python' },
        ]}
      />
      <Select
        label="Формат объяснения"
        options={[
          { value: 'short', label: 'Кратко' },
          { value: 'deep', label: 'Подробно' },
          { value: 'code', label: 'С примерами кода' },
        ]}
      />
    </div>
  ),
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

export const WholeForm: Story = {
  render: () => (
    <form
      style={{ ...column, gap: 12 }}
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Input placeholder="Имя пользователя*" required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Input placeholder="Telegram*" required />
        <Input placeholder="Электронная почта" type="email" />
      </div>
      <Input placeholder="Дата старта курса*" />
      <Select
        options={[
          { value: 'all', label: 'Выберите язык (доступно четыре)' },
          { value: 'java', label: 'Java' },
        ]}
      />
      <Checkbox label="Соглашаюсь получать разборы задач и новости платформы" />
    </form>
  ),
};
