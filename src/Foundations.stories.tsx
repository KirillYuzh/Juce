import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from './components/ui/Icon';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const colors = [
  ['--tb-primary', 'Primary'],
  ['--tb-primary-hover', 'Primary hover'],
  ['--tb-primary-active', 'Primary active'],
  ['--tb-secondary', 'Secondary'],
  ['--tb-secondary-soft', 'Secondary soft'],
  ['--tb-accent', 'Accent'],
  ['--tb-accent-soft', 'Accent soft'],
  ['--tb-accent-text', 'Accent text'],
  ['--tb-text-primary', 'Text primary'],
  ['--tb-text-secondary', 'Text secondary'],
  ['--tb-text-tertiary', 'Text tertiary'],
  ['--tb-bg-secondary', 'Background secondary'],
  ['--tb-bg-tertiary', 'Background tertiary'],
  ['--tb-dark', 'Dark'],
  ['--tb-success', 'Success'],
  ['--tb-error', 'Error'],
] as const;

const headings = [
  ['tb-h1', 'Дебетовая карта, которую рекомендуют друзья', 'H1 · 44/48 · 700'],
  ['tb-h2', 'Управляйте финансами с выгодой', 'H2 · 44/48 · 700'],
  ['tb-h3', 'Рекомендуемые продукты', 'H3 · 32/36 · 700'],
  ['tb-h4', 'Кредитная карта «Платинум»', 'H4 · 24/28 · 500'],
  ['tb-text-l', 'Основной текст страницы — 17/28, Neue Haas Unica.', 'L · 17/28 · 400'],
  ['tb-text-m', 'Текст интерфейса и карточек — 15/24, Neue Haas Unica.', 'M · 15/24 · 400'],
  ['tb-text-s', 'Подписи и служебный текст — 13/20.', 'S · 13/20 · 400'],
  ['tb-text-xs', 'МЕТКА · 11/14 · 0.4px', 'XS · 11/14 · 400'],
] as const;

const spacing = [
  ['4', '--tb-space-1'],
  ['8', '--tb-space-2'],
  ['12', '--tb-space-3'],
  ['16', '--tb-space-4'],
  ['24', '--tb-space-6'],
  ['32', '--tb-space-8'],
  ['48', '--tb-space-12'],
  ['64', '--tb-space-16'],
  ['96', '--tb-space-24'],
] as const;

const iconNames: IconName[] = [
  'search',
  'user',
  'menu',
  'close',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'arrowRight',
  'check',
  'star',
  'info',
  'shield',
  'phone',
  'mail',
  'doc',
  'apple',
  'android',
  'vk',
  'ok',
  'telegram',
];

export const Colors: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 24 }}>
        Цвета
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 16,
        }}
      >
        {colors.map(([token, label]) => (
          <div key={token}>
            <div
              style={{
                height: 96,
                borderRadius: 16,
                background: `var(${token})`,
                border: '1px solid var(--tb-border)',
              }}
            />
            <div style={{ marginTop: 8, font: '500 13px/18px var(--tb-font-text)' }}>{label}</div>
            <code style={{ font: '400 11px/16px monospace', color: 'var(--tb-text-secondary)' }}>
              {token}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 24 }}>
        Типографика
      </h2>
      {headings.map(([className, sample, note]) => (
        <div
          key={className}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 260px',
            gap: 24,
            alignItems: 'baseline',
            padding: '20px 0',
            borderBottom: '1px solid var(--tb-border)',
          }}
        >
          <span className={className}>{sample}</span>
          <code style={{ font: '400 12px/18px monospace', color: 'var(--tb-text-secondary)' }}>
            {note}
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 24 }}>
        Отступы
      </h2>
      {spacing.map(([label, token]) => (
        <div
          key={token}
          style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '8px 0' }}
        >
          <div
            style={{
              width: `var(${token})`,
              height: 24,
              background: 'var(--tb-primary)',
              borderRadius: 4,
            }}
          />
          <code style={{ font: '400 13px/20px monospace' }}>{token}</code>
          <span className="tb-text-s" style={{ color: 'var(--tb-text-secondary)' }}>
            {label}px
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 24 }}>
        Иконки
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 16,
        }}
      >
        {iconNames.map((name) => (
          <div
            key={name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              padding: 16,
              borderRadius: 16,
              background: 'var(--tb-bg-secondary)',
            }}
          >
            <Icon name={name} size={28} />
            <code style={{ font: '400 11px/14px monospace', color: 'var(--tb-text-secondary)' }}>
              {name}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};
