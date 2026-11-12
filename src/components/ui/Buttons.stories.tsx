import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, IconButton, TextLink } from './Button';

const meta = {
  title: 'Primitives/Buttons',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { children: 'Начать разбор' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'white', 'outline', 'ghost', 'dark'],
    },
    size: { control: 'inline-radio', options: ['s', 'm', 'l'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Как это работает?' },
};

export const Outline: Story = {
  args: { variant: 'outline', size: 'm', children: 'Больше задач' },
};

export const White: Story = {
  args: { variant: 'white', children: 'Смотреть вакансии' },
  globals: { backgrounds: { value: 'dark' } },
};

export const Loading: Story = {
  args: { loading: true, children: 'Продолжить' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Недоступно' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button>Начать разбор</Button>
      <Button variant="secondary">Как это работает?</Button>
      <Button variant="outline" size="m">
        Больше задач
      </Button>
      <Button variant="ghost" size="m">
        Отмена
      </Button>
      <Button variant="dark" size="m">
        android
      </Button>
      <Button variant="primary" size="s">
        Подробнее
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Button size="l">Кнопка 56</Button>
      <Button size="m">Кнопка 44</Button>
      <Button size="s">Кнопка 32</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button iconLeft="search" size="m">
        Скачать пример
      </Button>
      <Button variant="secondary" iconRight="arrowRight" size="m">
        Смотреть
      </Button>
    </div>
  ),
};

export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton icon="search" label="Поиск" />
      <IconButton icon="menu" label="Меню" />
      <IconButton icon="close" label="Закрыть" variant="plain" />
      <IconButton icon="search" label="Поиск" size="s" />
    </div>
  ),
};

export const Links: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <TextLink href="#link">Смотреть пример</TextLink>
      <TextLink href="#link" arrow>
        Открыть документацию
      </TextLink>
    </div>
  ),
};
