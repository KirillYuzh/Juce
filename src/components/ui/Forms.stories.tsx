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
      <Input label="Фамилия, имя и отчество" placeholder="Фамилия, имя и отчество*" />
      <Input label="Телефон" placeholder="Мобильный телефон*" type="tel" />
      <Input label="Почта" placeholder="Электронная почта" hint="Пришлём условия и статус заявки" />
      <Input
        label="Промокод"
        placeholder="Введите промокод"
        error="Такого промокода не существует"
        defaultValue="JUCE2026"
      />
    </div>
  ),
};

export const Textareas: Story = {
  render: () => (
    <div style={column}>
      <Textarea label="Комментарий" placeholder="Расскажите о себе" />
    </div>
  ),
};

export const Selects: Story = {
  render: () => (
    <div style={column}>
      <Select
        label="Повышенный кэшбэк"
        options={[
          { value: 'all', label: 'Выберите повышенный кэшбэк (четыре категории)' },
          { value: 'travel', label: 'Путешествия' },
          { value: 'food', label: 'Кафе и рестораны' },
          { value: 'transport', label: 'Транспорт' },
        ]}
      />
      <Select
        label="Срок вклада"
        options={[
          { value: '6', label: '6 месяцев' },
          { value: '12', label: '12 месяцев' },
          { value: '24', label: '24 месяца' },
        ]}
      />
    </div>
  ),
};

export const Checkboxes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox label="Соглашаюсь получать рекламу про кэшбэк" />
      <Checkbox label="Отмеченный пункт" defaultChecked />
      <Checkbox label="Недоступный пункт" disabled />
    </div>
  ),
};

export const Radios: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Radio name="citizenship" label="Да" defaultChecked />
      <Radio name="citizenship" label="Нет" />
      <Radio name="citizenship" label="Недоступно" disabled />
    </div>
  ),
};

export const Switches: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="Уведомления по карте" defaultChecked />
      <Switch label="Рекламные рассылки" />
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
      <Input placeholder="Фамилия, имя и отчество*" required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Input placeholder="Мобильный телефон*" type="tel" required />
        <Input placeholder="Электронная почта" type="email" />
      </div>
      <Input placeholder="Дата рождения*" />
      <Select
        options={[
          { value: 'all', label: 'Выберите повышенный кэшбэк (четыре категории)' },
          { value: 'travel', label: 'Путешествия' },
        ]}
      />
      <Checkbox label="Соглашаюсь получать рекламу про кэшбэк, повышенный процент и выгодные предложения" />
    </form>
  ),
};
