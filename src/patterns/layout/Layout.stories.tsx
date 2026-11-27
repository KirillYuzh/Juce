import { useState, type CSSProperties, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea, Checkbox, Radio, Switch } from '../../components/ui/Fields';
import { Chip, Badge, Avatar, Divider } from '../../components/ui/Display';
import { Callout } from '../../components/ui/Typography';
import { Icon } from '../../components/ui/Icon';

const meta: Meta = {
  title: 'Patterns/Layout',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Patterns — реальные сочетания примитивов, а не API: каждый пример показывает, как собрать экран из готовых компонентов.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Панель кода показывает полный исходник стори: импорты, стили, данные и хелперы
// собираются из общих блоков, поэтому в сниппете нет «…» и потерянных констант.
const doc = (...blocks: string[]) => blocks.join('\n\n');

const DOC_META = `const meta: Meta = {
  title: 'Patterns/Layout',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;`;

const DOC_STYLES = {
  card: `const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 720,
  gap: 'var(--tb-space-5)',
  padding: 'var(--tb-space-6)',
  background: 'var(--tb-surface)',
  border: '1px solid var(--tb-border)',
  borderRadius: 'var(--tb-radius-surface)',
  boxShadow: 'var(--tb-shadow-card)',
};`,
  row: `const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--tb-space-4)',
};`,
  stack: `const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--tb-space-1)',
  minWidth: 0,
};`,
  muted: `const muted: CSSProperties = { color: 'var(--tb-text-secondary)' };`,
};

const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 720,
  gap: 'var(--tb-space-5)',
  padding: 'var(--tb-space-6)',
  background: 'var(--tb-surface)',
  border: '1px solid var(--tb-border)',
  borderRadius: 'var(--tb-radius-surface)',
  boxShadow: 'var(--tb-shadow-card)',
};

const row: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--tb-space-4)',
};

const stack: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--tb-space-1)',
  minWidth: 0,
};

const muted: CSSProperties = { color: 'var(--tb-text-secondary)' };

const preventSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

const formatOptions = [
  { value: 'steps', label: 'По шагам, с объяснениями' },
  { value: 'short', label: 'Краткий ответ' },
  { value: 'code', label: 'С примерами кода' },
];

const FORM_SOURCE = doc(
  `import { type CSSProperties, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea, Checkbox, Radio } from '../../components/ui/Fields';
import { Divider } from '../../components/ui/Display';`,
  DOC_META,
  DOC_STYLES.card,
  DOC_STYLES.stack,
  DOC_STYLES.muted,
  `const preventSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();`,
  `const formatOptions = [
  { value: 'steps', label: 'По шагам, с объяснениями' },
  { value: 'short', label: 'Краткий ответ' },
  { value: 'code', label: 'С примерами кода' },
];`,
  `export const Form: Story = {
  name: 'Form',
  render: () => (
    <form style={card} onSubmit={preventSubmit}>
      <div style={stack}>
        <h2 className="tb-h4" style={{ margin: 0 }}>
          Новая задача
        </h2>
        <p className="tb-text-s" style={{ margin: 0, ...muted }}>
          Опишите задачу — Джупсик подберёт разбор и нужные разделы документации.
        </p>
      </div>

      <Input placeholder="Название задачи" required />
      <Select aria-label="Формат разбора" options={formatOptions} />
      <Textarea placeholder="Комментарий" rows={3} />

      <Divider />

      <Checkbox label="Присылать разборы по теме задачи" defaultChecked />

      <fieldset
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--tb-space-3)',
          margin: 0,
          padding: 0,
          border: 0,
        }}
      >
        <legend
          className="tb-text-s"
          style={{ padding: 0, marginBottom: 'var(--tb-space-1)', ...muted }}
        >
          Нужен разбор по шагам?
        </legend>
        <Radio name="steps" label="Да, по шагам с объяснениями" defaultChecked />
        <Radio name="steps" label="Нет, достаточно краткого ответа" />
      </fieldset>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--tb-space-3)' }}>
        <Button variant="secondary">Отмена</Button>
        <Button type="submit">Создать задачу</Button>
      </div>
    </form>
  ),
};`
);

export const Form: Story = {
  name: 'Form',
  parameters: { docs: { source: { code: FORM_SOURCE } } },
  render: () => (
    <form style={card} onSubmit={preventSubmit}>
      <div style={stack}>
        <h2 className="tb-h4" style={{ margin: 0 }}>
          Новая задача
        </h2>
        <p className="tb-text-s" style={{ margin: 0, ...muted }}>
          Опишите задачу — Джупсик подберёт разбор и нужные разделы документации.
        </p>
      </div>

      <Input placeholder="Название задачи" required />
      <Select aria-label="Формат разбора" options={formatOptions} />
      <Textarea placeholder="Комментарий" rows={3} />

      <Divider />

      <Checkbox label="Присылать разборы по теме задачи" defaultChecked />

      <fieldset
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--tb-space-3)',
          margin: 0,
          padding: 0,
          border: 0,
        }}
      >
        <legend
          className="tb-text-s"
          style={{ padding: 0, marginBottom: 'var(--tb-space-1)', ...muted }}
        >
          Нужен разбор по шагам?
        </legend>
        <Radio name="steps" label="Да, по шагам с объяснениями" defaultChecked />
        <Radio name="steps" label="Нет, достаточно краткого ответа" />
      </fieldset>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--tb-space-3)' }}>
        <Button variant="secondary">Отмена</Button>
        <Button type="submit">Создать задачу</Button>
      </div>
    </form>
  ),
};

const settings = [
  {
    id: 'digest',
    title: 'Дайджест разборов',
    description: 'Раз в неделю присылаем подборку новых задач по вашим темам.',
    checked: true,
  },
  {
    id: 'reminders',
    title: 'Напоминания о дедлайнах',
    description: 'Письмо за день до срока сдачи задачи.',
    checked: true,
  },
  {
    id: 'mentions',
    title: 'Ответы на комментарии',
    description: 'Уведомлять, когда Джупсик отвечает в вашей задаче.',
    checked: false,
  },
];

const SETTINGS_SOURCE = doc(
  `import { type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../../components/ui/Display';
import { Switch } from '../../components/ui/Fields';`,
  DOC_META,
  DOC_STYLES.card,
  DOC_STYLES.row,
  DOC_STYLES.stack,
  DOC_STYLES.muted,
  `const settings = [
  {
    id: 'digest',
    title: 'Дайджест разборов',
    description: 'Раз в неделю присылаем подборку новых задач по вашим темам.',
    checked: true,
  },
  {
    id: 'reminders',
    title: 'Напоминания о дедлайнах',
    description: 'Письмо за день до срока сдачи задачи.',
    checked: true,
  },
  {
    id: 'mentions',
    title: 'Ответы на комментарии',
    description: 'Уведомлять, когда Джупсик отвечает в вашей задаче.',
    checked: false,
  },
];`,
  `export const Settings: Story = {
  name: 'Settings',
  render: () => (
    <div style={{ ...card, gap: 0, paddingBlock: 0 }}>
      {settings.map((item, index) => (
        <div key={item.id}>
          {index > 0 && <Divider />}
          <div
            style={{
              ...row,
              justifyContent: 'space-between',
              paddingBlock: 'var(--tb-space-4)',
            }}
          >
            <div style={stack}>
              <span className="tb-text-m" style={{ fontWeight: 500 }}>
                {item.title}
              </span>
              <span className="tb-text-s" style={muted}>
                {item.description}
              </span>
            </div>
            <Switch defaultChecked={item.checked} aria-label={item.title} />
          </div>
        </div>
      ))}
    </div>
  ),
};`
);

export const Settings: Story = {
  name: 'Settings',
  parameters: { docs: { source: { code: SETTINGS_SOURCE } } },
  render: () => (
    <div style={{ ...card, gap: 0, paddingBlock: 0 }}>
      {settings.map((item, index) => (
        <div key={item.id}>
          {index > 0 && <Divider />}
          <div
            style={{
              ...row,
              justifyContent: 'space-between',
              paddingBlock: 'var(--tb-space-4)',
            }}
          >
            <div style={stack}>
              <span className="tb-text-m" style={{ fontWeight: 500 }}>
                {item.title}
              </span>
              <span className="tb-text-s" style={muted}>
                {item.description}
              </span>
            </div>
            <Switch defaultChecked={item.checked} aria-label={item.title} />
          </div>
        </div>
      ))}
    </div>
  ),
};

const filters = [
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'algorithms', label: 'Алгоритмы' },
  { value: 'databases', label: 'Базы данных' },
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'math', label: 'Математика' },
];

function SearchFiltersDemo() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string[]>(['java']);

  const toggle = (value: string) =>
    setActive((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );

  return (
    <div style={card}>
      <Input
        aria-label="Поиск по задачам"
        placeholder="Поиск по задачам"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={{ paddingRight: 'var(--tb-space-10)' }}
        suffixSlot={<Icon name="search" size={20} />}
      />

      <div
        role="group"
        aria-label="Фильтры"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tb-space-2)' }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.value}
            variant="outline"
            active={active.includes(filter.value)}
            onClick={() => toggle(filter.value)}
          >
            {filter.label}
          </Chip>
        ))}
      </div>

      <div style={{ ...row, justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          size="m"
          disabled={query === '' && active.length === 0}
          onClick={() => {
            setQuery('');
            setActive([]);
          }}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
}

const SEARCH_FILTERS_SOURCE = doc(
  `import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Display';
import { Input } from '../../components/ui/Fields';
import { Icon } from '../../components/ui/Icon';`,
  DOC_META,
  DOC_STYLES.card,
  DOC_STYLES.row,
  `const filters = [
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'algorithms', label: 'Алгоритмы' },
  { value: 'databases', label: 'Базы данных' },
  { value: 'frontend', label: 'Фронтенд' },
  { value: 'math', label: 'Математика' },
];`,
  `function SearchFiltersDemo() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string[]>(['java']);

  const toggle = (value: string) =>
    setActive((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );

  return (
    <div style={card}>
      <Input
        aria-label="Поиск по задачам"
        placeholder="Поиск по задачам"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={{ paddingRight: 'var(--tb-space-10)' }}
        suffixSlot={<Icon name="search" size={20} />}
      />

      <div
        role="group"
        aria-label="Фильтры"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--tb-space-2)' }}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.value}
            variant="outline"
            active={active.includes(filter.value)}
            onClick={() => toggle(filter.value)}
          >
            {filter.label}
          </Chip>
        ))}
      </div>

      <div style={{ ...row, justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          size="m"
          disabled={query === '' && active.length === 0}
          onClick={() => {
            setQuery('');
            setActive([]);
          }}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
}`,
  `export const SearchFilters: Story = {
  name: 'Search filters',
  render: () => <SearchFiltersDemo />,
};`
);

export const SearchFilters: Story = {
  name: 'Search filters',
  parameters: { docs: { source: { code: SEARCH_FILTERS_SOURCE } } },
  render: () => <SearchFiltersDemo />,
};

const EMPTY_STATE_SOURCE = doc(
  `import { type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';`,
  DOC_META,
  DOC_STYLES.card,
  DOC_STYLES.row,
  DOC_STYLES.muted,
  `export const EmptyState: Story = {
  name: 'Empty state',
  render: () => (
    <div
      style={{
        ...card,
        alignItems: 'center',
        textAlign: 'center',
        paddingBlock: 'var(--tb-space-12)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'var(--tb-space-12)',
          height: 'var(--tb-space-12)',
          borderRadius: 'var(--tb-radius-surface)',
          background: 'var(--tb-bg-tertiary)',
          color: 'var(--tb-text-secondary)',
        }}
      >
        <Icon name="search" size={24} />
      </span>
      <h2 className="tb-h4" style={{ margin: 0 }}>
        Ничего не нашлось
      </h2>
      <p className="tb-text-m" style={{ margin: 0, maxWidth: 420, ...muted }}>
        Попробуйте изменить формулировку или сбросить фильтры — покажем задачи из всех направлений.
      </p>
      <div style={{ ...row, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="secondary">Сбросить фильтры</Button>
        <Button iconLeft="plus">Новая задача</Button>
      </div>
    </div>
  ),
};`
);

export const EmptyState: Story = {
  name: 'Empty state',
  parameters: { docs: { source: { code: EMPTY_STATE_SOURCE } } },
  render: () => (
    <div
      style={{
        ...card,
        alignItems: 'center',
        textAlign: 'center',
        paddingBlock: 'var(--tb-space-12)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'var(--tb-space-12)',
          height: 'var(--tb-space-12)',
          borderRadius: 'var(--tb-radius-surface)',
          background: 'var(--tb-bg-tertiary)',
          color: 'var(--tb-text-secondary)',
        }}
      >
        <Icon name="search" size={24} />
      </span>
      <h2 className="tb-h4" style={{ margin: 0 }}>
        Ничего не нашлось
      </h2>
      <p className="tb-text-m" style={{ margin: 0, maxWidth: 420, ...muted }}>
        Попробуйте изменить формулировку или сбросить фильтры — покажем задачи из всех направлений.
      </p>
      <div style={{ ...row, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="secondary">Сбросить фильтры</Button>
        <Button iconLeft="plus">Новая задача</Button>
      </div>
    </div>
  ),
};

const entities = [
  {
    id: 'anna',
    initials: 'АК',
    name: 'Анна Ковалёва',
    status: 'В работе' as const,
    meta: 'Java · ранжирование матриц',
    price: '2 400 ₽',
    due: 'до 28 ноября',
  },
  {
    id: 'ivan',
    initials: 'ИП',
    name: 'Иван Петров',
    status: 'На проверке' as const,
    meta: 'Go · утечка горутины',
    price: '1 800 ₽',
    due: 'до 2 декабря',
  },
];

const ENTITY_ROW_SOURCE = doc(
  `import { type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Avatar, Badge, Divider } from '../../components/ui/Display';`,
  DOC_META,
  DOC_STYLES.card,
  DOC_STYLES.row,
  DOC_STYLES.stack,
  DOC_STYLES.muted,
  `const entities = [
  {
    id: 'anna',
    initials: 'АК',
    name: 'Анна Ковалёва',
    status: 'В работе' as const,
    meta: 'Java · ранжирование матриц',
    price: '2 400 ₽',
    due: 'до 28 ноября',
  },
  {
    id: 'ivan',
    initials: 'ИП',
    name: 'Иван Петров',
    status: 'На проверке' as const,
    meta: 'Go · утечка горутины',
    price: '1 800 ₽',
    due: 'до 2 декабря',
  },
];`,
  `export const EntityRow: Story = {
  name: 'Entity row',
  render: () => (
    <div style={{ ...card, gap: 0, paddingBlock: 0 }}>
      {entities.map((entity, index) => (
        <div key={entity.id}>
          {index > 0 && <Divider />}
          <div style={{ ...row, paddingBlock: 'var(--tb-space-4)' }}>
            <Avatar initials={entity.initials} alt={entity.name} size="l" />
            <div style={{ ...stack, flex: 1 }}>
              <span style={{ ...row, gap: 'var(--tb-space-2)' }}>
                <span className="tb-text-m" style={{ fontWeight: 500 }}>
                  {entity.name}
                </span>
                <Badge tone={entity.status === 'В работе' ? 'success' : 'warning'}>
                  {entity.status}
                </Badge>
              </span>
              <span className="tb-text-s" style={muted}>
                {entity.meta}
              </span>
            </div>
            <div style={{ ...stack, alignItems: 'flex-end', gap: 0 }}>
              <span className="tb-text-m">{entity.price}</span>
              <span className="tb-text-xs" style={{ color: 'var(--tb-text-tertiary)' }}>
                {entity.due}
              </span>
            </div>
            <Button variant="secondary" size="s">
              Открыть
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};`
);

export const EntityRow: Story = {
  name: 'Entity row',
  parameters: { docs: { source: { code: ENTITY_ROW_SOURCE } } },
  render: () => (
    <div style={{ ...card, gap: 0, paddingBlock: 0 }}>
      {entities.map((entity, index) => (
        <div key={entity.id}>
          {index > 0 && <Divider />}
          <div style={{ ...row, paddingBlock: 'var(--tb-space-4)' }}>
            <Avatar initials={entity.initials} alt={entity.name} size="l" />
            <div style={{ ...stack, flex: 1 }}>
              <span style={{ ...row, gap: 'var(--tb-space-2)' }}>
                <span className="tb-text-m" style={{ fontWeight: 500 }}>
                  {entity.name}
                </span>
                <Badge tone={entity.status === 'В работе' ? 'success' : 'warning'}>
                  {entity.status}
                </Badge>
              </span>
              <span className="tb-text-s" style={muted}>
                {entity.meta}
              </span>
            </div>
            <div style={{ ...stack, alignItems: 'flex-end', gap: 0 }}>
              <span className="tb-text-m">{entity.price}</span>
              <span className="tb-text-xs" style={{ color: 'var(--tb-text-tertiary)' }}>
                {entity.due}
              </span>
            </div>
            <Button variant="secondary" size="s">
              Открыть
            </Button>
          </div>
        </div>
      ))}
    </div>
  ),
};

function NotificationDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 720 }}>
      {visible ? (
        <div style={{ ...row, alignItems: 'flex-start' }}>
          <Callout
            tone="success"
            style={{ flex: 1 }}
            action={{ label: 'Открыть', onClick: () => {} }}
          >
            Разбор готов: «Почему утекает горутина». Можно открыть и задать вопросы.
          </Callout>
          <Button
            variant="ghost"
            size="s"
            iconLeft="close"
            aria-label="Закрыть уведомление"
            onClick={() => setVisible(false)}
          />
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Показать уведомление снова
        </Button>
      )}
    </div>
  );
}

const NOTIFICATION_SOURCE = doc(
  `import { useState, type CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/ui/Button';
import { Callout } from '../../components/ui/Typography';`,
  DOC_META,
  DOC_STYLES.row,
  `function NotificationDemo() {
  const [visible, setVisible] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 720 }}>
      {visible ? (
        <div style={{ ...row, alignItems: 'flex-start' }}>
          <Callout
            tone="success"
            style={{ flex: 1 }}
            action={{ label: 'Открыть', onClick: () => {} }}
          >
            Разбор готов: «Почему утекает горутина». Можно открыть и задать вопросы.
          </Callout>
          <Button
            variant="ghost"
            size="s"
            iconLeft="close"
            aria-label="Закрыть уведомление"
            onClick={() => setVisible(false)}
          />
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setVisible(true)}>
          Показать уведомление снова
        </Button>
      )}
    </div>
  );
}`,
  `export const Notification: Story = {
  name: 'Notification',
  render: () => <NotificationDemo />,
};`
);

export const Notification: Story = {
  name: 'Notification',
  parameters: { docs: { source: { code: NOTIFICATION_SOURCE } } },
  render: () => <NotificationDemo />,
};
