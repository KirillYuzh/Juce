import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar, Badge, Chip, Divider, Logo, Progress, Skeleton, Spinner } from './Display';
import { Icon } from './Icon';

const meta: Meta = {
  title: 'Primitives/Display',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Badges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge>Neutral</Badge>
      <Badge tone="accent">Premium</Badge>
      <Badge tone="success">Одобрено</Badge>
      <Badge tone="error">Ошибка</Badge>
      <Badge tone="warning">Проверка</Badge>
    </div>
  ),
};

export const Chips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Chip>Все</Chip>
      <Chip active>Дебетовая карта</Chip>
      <Chip>Кредитная карта</Chip>
      <Chip>Вклад</Chip>
    </div>
  ),
};

export const DarkChips: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 24, borderRadius: 16, background: '#333' }}>
      <Chip tone="dark">О нас</Chip>
      <Chip tone="dark">Вакансии</Chip>
      <Chip tone="dark">Работа в ИТ</Chip>
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar size="s" initials="ДК" />
      <Avatar initials="ТБ" />
      <Avatar size="l" initials="АС" />
    </div>
  ),
};

export const ProgressBars: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 360 }}>
      <div>
        <div className="tb-text-s" style={{ marginBottom: 8 }}>
          Акцентная (кэшбэк)
        </div>
        <Progress value={35} />
      </div>
      <div>
        <div className="tb-text-s" style={{ marginBottom: 8 }}>
          Вклад
        </div>
        <Progress value={70} tone="brand" />
      </div>
    </div>
  ),
};

export const Spinners: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner size={16} />
      <Spinner size={24} />
      <Spinner size={40} />
    </div>
  ),
};

export const Skeletons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 360 }}>
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} />
      <Skeleton height={16} />
      <Skeleton height={120} radius={24} />
    </div>
  ),
};

export const Dividers: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <p className="tb-text-m">До раздела</p>
      <Divider />
      <p className="tb-text-m" style={{ paddingTop: 16 }}>
        После раздела
      </p>
    </div>
  ),
};

export const Logos: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Logo />
      <Logo className="tb-h2" />
    </div>
  ),
};

export const IconsGallery: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', maxWidth: 400 }}>
      <Icon name="search" />
      <Icon name="user" />
      <Icon name="menu" />
      <Icon name="chevronDown" />
      <Icon name="arrowRight" />
      <Icon name="info" />
      <Icon name="star" />
      <Icon name="shield" />
    </div>
  ),
};
