import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';
import { Icon } from './Icon';

const meta: Meta = {
  title: 'Primitives/Collapsible',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const trigger: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  minHeight: 40,
  padding: '0 14px',
  borderRadius: 12,
  background: 'var(--tb-secondary-soft)',
  font: '500 14px/20px var(--tb-font-text)',
};

const content: CSSProperties = {
  marginTop: 8,
  padding: 16,
  borderRadius: 12,
  background: 'var(--tb-bg-secondary)',
  font: '400 14px/22px var(--tb-font-text)',
};

export const Default: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Collapsible>
        <CollapsibleTrigger style={trigger}>
          Условия использования
          <Icon name="chevronDown" size={16} />
        </CollapsibleTrigger>
        <CollapsibleContent style={content}>
          Базовый доступ бесплатен, командный тариф — 10 000 ₽ в месяц.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <Collapsible defaultOpen>
        <CollapsibleTrigger style={trigger}>
          Условия использования
          <Icon name="chevronDown" size={16} />
        </CollapsibleTrigger>
        <CollapsibleContent style={content}>
          Базовый доступ бесплатен, командный тариф — 10 000 ₽ в месяц.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const WithoutAnimationOfMount: Story = {
  name: 'Keep mounted',
  render: () => (
    <div style={{ width: 360 }}>
      <Collapsible keepMounted>
        <CollapsibleTrigger style={trigger}>
          Документы
          <Icon name="chevronDown" size={16} />
        </CollapsibleTrigger>
        <CollapsibleContent style={content}>
          Содержимое остаётся в DOM и скрывается атрибутом hidden.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
