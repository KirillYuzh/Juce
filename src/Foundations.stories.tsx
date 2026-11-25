import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, type IconName } from './components/ui/Icon';
import { antdIcons } from './components/ui/icons';
import { THEMES } from './styles/themes';

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
  ['tb-h1', 'Разбираем код и формулы без магии', 'H1 · 44/48 · 700'],
  ['tb-h2', 'Java, Go и математика в одном месте', 'H2 · 44/48 · 700'],
  ['tb-h3', 'Задачи этой недели', 'H3 · 32/36 · 700'],
  ['tb-h4', 'Горутины и каналы', 'H4 · 24/28 · 500'],
  ['tb-text-l', 'Основной текст страницы — 17/28, Manrope.', 'L · 17/28 · 400'],
  ['tb-text-m', 'Текст интерфейса и карточек — 15/24, Manrope.', 'M · 15/24 · 400'],
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

const iconNames = [...Object.keys(antdIcons), 'vk', 'ok'] as IconName[];

const themeRoles = [
  ['--tb-bg', 'Page'],
  ['--tb-bg-secondary', 'Panel'],
  ['--tb-surface', 'Card'],
  ['--tb-bg-tertiary', 'Hover'],
  ['--tb-primary', 'Primary'],
  ['--tb-secondary', 'Secondary'],
  ['--tb-accent', 'Accent'],
  ['--tb-accent-text', 'Accent text'],
  ['--tb-text-primary', 'Text'],
  ['--tb-border', 'Border'],
] as const;

const themeScopes = [
  { value: 'light', title: 'Светлая', mode: 'light' },
  { value: 'dark', title: 'Тёмная', mode: 'dark' },
  ...THEMES,
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
            <code
              style={{
                font: '400 11px/16px var(--tb-font-mono)',
                color: 'var(--tb-text-secondary)',
              }}
            >
              {token}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Themes: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 8 }}>
        Темы — цвет
      </h2>
      <p className="tb-text-m" style={{ color: 'var(--tb-text-secondary)', marginBottom: 24 }}>
        Токены живут на двух ортогональных осях. Цвет задаёт <code>[data-theme]</code>: светлая,
        тёмная и палитры wasabi. Форма задаётся отдельно через <code>[data-skin]</code> и от цвета
        не зависит. Имена токенов на обеих осях одни и те же.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {themeScopes.map((scope) => (
          <div
            key={scope.value}
            data-theme={scope.value}
            style={{
              padding: 20,
              borderRadius: 'var(--tb-radius-surface)',
              background: 'var(--tb-bg)',
              color: 'var(--tb-text-primary)',
              boxShadow: 'inset 0 0 0 1px var(--tb-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span style={{ font: '500 15px/24px var(--tb-font-text)' }}>{scope.title}</span>
              <code
                style={{
                  font: '400 12px/18px var(--tb-font-mono)',
                  color: 'var(--tb-text-secondary)',
                }}
              >
                {`data-theme="${scope.value}"`}
              </code>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: 8,
                marginBottom: 16,
              }}
            >
              {themeRoles.map(([token, label]) => (
                <div
                  key={token}
                  title={`${label} · ${token}`}
                  style={{
                    height: 40,
                    borderRadius: 'var(--tb-radius-s)',
                    background: `var(${token})`,
                    boxShadow: 'inset 0 0 0 1px var(--tb-border)',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'grid', gap: 4, marginBottom: 16 }}>
              <span
                style={{
                  color: 'var(--tb-text-primary)',
                  font: '400 13px/18px var(--tb-font-text)',
                }}
              >
                Primary — читаемый текст
              </span>
              <span
                style={{
                  color: 'var(--tb-text-secondary)',
                  font: '400 13px/18px var(--tb-font-text)',
                }}
              >
                Secondary — подпись
              </span>
              <span
                style={{ color: 'var(--tb-text-muted)', font: '400 13px/18px var(--tb-font-text)' }}
              >
                Muted — служебная метка
              </span>
              <span
                style={{
                  color: 'var(--tb-text-tertiary)',
                  font: '400 13px/18px var(--tb-font-text)',
                }}
              >
                Tertiary — только декор
              </span>
              <span
                style={{ color: 'var(--tb-text-link)', font: '400 13px/18px var(--tb-font-text)' }}
              >
                Ссылка
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <span
                style={{
                  background: 'var(--tb-accent)',
                  color: 'var(--tb-on-accent)',
                  borderRadius: 'var(--tb-radius-chip)',
                  padding: '2px 10px',
                  font: '500 13px/18px var(--tb-font-text)',
                }}
              >
                Badge
              </span>
              <span
                style={{
                  background: 'var(--tb-primary)',
                  color: 'var(--tb-on-primary)',
                  borderRadius: 'var(--tb-radius-control)',
                  padding: '6px 12px',
                  font: '500 13px/18px var(--tb-font-text)',
                }}
              >
                Button
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Skins: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <h2 className="tb-h2" style={{ marginBottom: 8 }}>
        Скины — форма
      </h2>
      <p className="tb-text-m" style={{ color: 'var(--tb-text-secondary)', marginBottom: 24 }}>
        <code>[data-skin="blueprint"]</code> меняет только форму: нулевые радиусы, моно-заголовки,
        сетка на фоне и без теней. Примитивы цвета не трогаются, поэтому скин сочетается с любой
        темой. Чипы, переключатели и аватары остаются круглыми. Вложенный <code>[data-theme]</code>{' '}
        сбрасывает форму родителя.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {(['light', 'dark'] as const).map((theme) => (
          <div
            key={theme}
            data-theme={theme}
            data-skin="blueprint"
            style={{
              padding: 20,
              borderRadius: 'var(--tb-radius-surface)',
              background: 'var(--tb-bg)',
              backgroundImage: 'var(--tb-surface-pattern)',
              backgroundSize: 'var(--tb-surface-pattern-size)',
              color: 'var(--tb-text-primary)',
              boxShadow: 'inset 0 0 0 1px var(--tb-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span style={{ font: '600 18px/26px var(--tb-font-heading)' }}>Blueprint</span>
              <code
                style={{
                  font: '400 12px/18px var(--tb-font-mono)',
                  color: 'var(--tb-text-secondary)',
                }}
              >
                {`data-theme="${theme}"`}
              </code>
            </div>
            <div
              style={{
                padding: 16,
                background: 'var(--tb-surface)',
                border: '1px solid var(--tb-border-control)',
              }}
            >
              <div style={{ font: '600 15px/22px var(--tb-font-heading)', marginBottom: 12 }}>
                Схема запроса
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <span
                  style={{
                    background: 'var(--tb-primary)',
                    color: 'var(--tb-on-primary)',
                    borderRadius: 'var(--tb-radius-control)',
                    padding: '6px 12px',
                    font: '500 13px/18px var(--tb-font-text)',
                  }}
                >
                  Запустить
                </span>
                <span
                  style={{
                    borderRadius: 'var(--tb-radius-chip)',
                    border: '1px solid var(--tb-border-control)',
                    padding: '2px 10px',
                    font: '500 12px/18px var(--tb-font-text)',
                  }}
                >
                  chip
                </span>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--tb-radius-avatar)',
                    background: 'var(--tb-accent)',
                    color: 'var(--tb-on-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    font: '600 13px/18px var(--tb-font-text)',
                  }}
                >
                  BP
                </span>
              </div>
            </div>
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
          <code
            style={{ font: '400 12px/18px var(--tb-font-mono)', color: 'var(--tb-text-secondary)' }}
          >
            {note}
          </code>
        </div>
      ))}

      <div style={{ marginTop: 40, display: 'grid', gap: 24 }}>
        <div>
          <code
            style={{ font: '400 12px/18px var(--tb-font-mono)', color: 'var(--tb-text-secondary)' }}
          >
            --tb-font-quote · Linux Libertine
          </code>
          <blockquote style={{ margin: '8px 0 0', font: '400 21px/32px var(--tb-font-quote)' }}>
            «Доказательство — это не магия, а цепочка шагов. Мы делаем так, чтобы каждый шаг было
            видно».
          </blockquote>
        </div>
        <div>
          <code
            style={{ font: '400 12px/18px var(--tb-font-mono)', color: 'var(--tb-text-secondary)' }}
          >
            --tb-font-mono · JetBrains Mono
          </code>
          <pre
            style={{
              margin: '8px 0 0',
              padding: 16,
              borderRadius: 12,
              background: 'var(--tb-bg-secondary)',
              font: '400 13px/20px var(--tb-font-mono)',
              overflowX: 'auto',
            }}
          >
            {`const cashback = rates.find((rate) => rate.category === 'travel');`}
          </pre>
        </div>
      </div>
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
          <code style={{ font: '400 13px/20px var(--tb-font-mono)' }}>{token}</code>
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
      <h2 className="tb-h2" style={{ marginBottom: 8 }}>
        Иконки
      </h2>
      <p className="tb-text-s" style={{ margin: '0 0 24px', color: 'var(--tb-text-secondary)' }}>
        Ant Design Icons (MIT), данные лежат в
        <code style={{ font: '400 13px/20px var(--tb-font-mono)' }}>
          src/components/ui/icons.ts
        </code>
        .
      </p>
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
            <code
              style={{
                font: '400 11px/14px var(--tb-font-mono)',
                color: 'var(--tb-text-secondary)',
              }}
            >
              {name}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
};
