import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, Page, PageContent, PageHeader } from './Page';
import { Button } from '../Button';
import { Card, CardBody, CardMedia } from '../Card';
import { Badge, Divider, type BadgeTone } from '../Display';
import { Input } from '../Fields';
import { Icon, type IconName } from '../Icon';
import { Grid, Stack } from '../Layout';
import { List, ListRow } from '../List';
import { Tabs } from '../Navigation';
import { Section } from '../Section';
import { Table, type TableColumn } from '../Table';
import { DescriptionList } from '../DescriptionList';
import { Image } from '../Image';
import { Heading, Text } from '../Typography';

const meta: Meta = {
  title: 'Primitives/Page',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Page>
      <PageHeader
        title="Проект «Вектор»"
        description="Сводка по репозиторию, задачам и последним изменениям."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '#' },
              { label: 'Проекты', href: '#' },
              { label: 'Вектор' },
            ]}
          />
        }
        actions={
          <>
            <Button size="s" variant="secondary">
              Экспорт
            </Button>
            <Button size="s">Настройки</Button>
          </>
        }
      />
      <PageContent>
        <Stack gap="6">
          <Heading level={2}>Обзор</Heading>
          <Text tone="secondary">
            Страница собрана из Page, PageHeader и PageContent: шапка держит заголовок, хлебные
            крошки и действия, контент — ширину контейнера и вертикальные отступы.
          </Text>
          <Button size="s" variant="ghost">
            Открыть отчёт
          </Button>
        </Stack>
      </PageContent>
    </Page>
  ),
};

interface EntityStoryArgs {
  photo?: string;
}

export const EntityPage: StoryObj<EntityStoryArgs> = {
  name: 'Entity page',
  args: { photo: '/images/wang/laugh.jpeg' },
  argTypes: {
    photo: {
      control: 'text',
      description: 'Фото сущности. Без фото в этой области показывается раздел pinned.',
    },
  },
  render: ({ photo }) => (
    <Page>
      <PageContent>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '296px minmax(0, 1fr)',
            gap: 'var(--tb-space-8)',
            alignItems: 'start',
          }}
        >
          <Stack gap="4">
            <div
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 'var(--tb-radius-pill)',
                overflow: 'hidden',
              }}
            >
              <Image src="/images/wang/smile.png" alt="John Joe" ratio="square" />
            </div>
            <Heading level={1}>John Joe</Heading>
            <Text size="m" tone="secondary">
              Собираю Juce UI. Автор Gobellim и научной платформы университета.
            </Text>
            <Button size="s" variant="secondary" fullWidth>
              Подписаться
            </Button>
            <Stack direction="row" gap="2" align="center">
              <Icon name="user" size={16} />
              <Text size="s" tone="secondary">
                128 подписчиков · 42 подписки
              </Text>
            </Stack>
            <Divider />
            <DescriptionList
              items={[
                { id: 'location', label: 'Локация', value: 'Москва, UTC+3' },
                {
                  id: 'site',
                  label: 'Сайт',
                  value: (
                    <Text as="span" size="s" href="#" variant="hover">
                      juce.dev
                    </Text>
                  ),
                },
              ]}
            />
          </Stack>

          <Stack gap="6">
            {photo ? (
              <Card>
                <CardMedia position="top">
                  <Image src={photo} alt="Фото сущности" ratio="photo" />
                </CardMedia>
              </Card>
            ) : (
              <Stack gap="3">
                <Stack direction="row" gap="3" align="center" justify="between" wrap>
                  <Heading level={2}>Закреплённые</Heading>
                  <Button size="s" variant="secondary">
                    Настроить
                  </Button>
                </Stack>
                <Grid columns={2} gap="4">
                  {pinnedRepos.map((repo) => (
                    <Card key={repo.id}>
                      <CardBody>
                        <Stack gap="3">
                          <Stack direction="row" gap="2" align="center" justify="between">
                            <Stack direction="row" gap="2" align="center">
                              <Icon name="folder" size={16} />
                              <Text as="a" href="#" variant="hover" size="s" weight="medium">
                                {repo.name}
                              </Text>
                            </Stack>
                            <Badge>Публичный</Badge>
                          </Stack>
                          <Text size="s" tone="secondary">
                            {repo.description}
                          </Text>
                          <Stack direction="row" gap="4" align="center">
                            <Stack direction="row" gap="2" align="center">
                              <span
                                aria-hidden="true"
                                style={{
                                  width: 'var(--tb-space-2)',
                                  height: 'var(--tb-space-2)',
                                  borderRadius: 'var(--tb-radius-circle)',
                                  background: languageColor[repo.language] ?? 'var(--tb-gray-400)',
                                }}
                              />
                              <Text as="span" size="xs" tone="secondary">
                                {repo.language}
                              </Text>
                            </Stack>
                            <Stack direction="row" gap="1" align="center">
                              <Icon name="star" size={14} />
                              <Text as="span" size="xs" tone="secondary">
                                {repo.stars}
                              </Text>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Grid>
              </Stack>
            )}
          </Stack>
        </div>
      </PageContent>
    </Page>
  ),
};

export const EntityPagePinned: StoryObj<EntityStoryArgs> = {
  ...EntityPage,
  name: 'Entity page (без фото)',
  args: { photo: undefined },
};

interface RepoFile {
  id: string;
  name: string;
  folder?: boolean;
  message: string;
  date: string;
}

const repoFiles: RepoFile[] = [
  {
    id: 'src',
    name: 'src',
    folder: true,
    message: 'Слои, контракты и фикстуры правил',
    date: '2 дня назад',
  },
  {
    id: 'openspec',
    name: 'openspec',
    folder: true,
    message: 'Контракты компонентов и тем',
    date: '2 дня назад',
  },
  {
    id: 'tools',
    name: 'tools',
    folder: true,
    message: 'Правила ast-grep и базовая линия тестов',
    date: '5 дней назад',
  },
  { id: 'docs', name: 'docs', folder: true, message: 'Рантайм и карта фич', date: '5 дней назад' },
  { id: 'package', name: 'package.json', message: 'Подняли базовую линию тестов', date: 'вчера' },
  { id: 'readme', name: 'README.md', message: 'Описание пакета и проверок', date: 'неделю назад' },
  {
    id: 'tsconfig',
    name: 'tsconfig.json',
    message: 'Строгий режим без any',
    date: '2 недели назад',
  },
];

const repoTopics = ['react', 'ui-kit', 'design-system', 'storybook'];

const fileColumns: TableColumn<RepoFile>[] = [
  {
    id: 'name',
    kind: 'node',
    header: 'Имя',
    width: '44%',
    cell: (row) => (
      <Stack direction="row" gap="2" align="center">
        <Icon name={row.folder ? 'folder' : 'file'} size={16} />
        <Text as="span" size="s" weight={row.folder ? 'medium' : 'regular'}>
          {row.name}
        </Text>
      </Stack>
    ),
  },
  { id: 'message', kind: 'value', header: 'Последний коммит', value: (row) => row.message },
  { id: 'date', kind: 'value', header: 'Обновлён', align: 'end', value: (row) => row.date },
];

export const RepositoryPage: Story = {
  name: 'Repository',
  render: () => (
    <Page>
      <PageHeader
        title="juce-ui"
        description="React UI-кит: примитивы, компоненты и паттерны для продуктовых интерфейсов."
        breadcrumbs={<Breadcrumbs items={[{ label: 'juce', href: '#' }, { label: 'juce-ui' }]} />}
        actions={
          <>
            <Button size="s" variant="secondary" iconLeft="eye">
              Следить
            </Button>
            <Button size="s" variant="secondary" iconLeft="fork">
              Форк
            </Button>
            <Button size="s" variant="secondary" iconLeft="star">
              2 431
            </Button>
          </>
        }
      />
      <PageContent>
        <Stack gap="6">
          <Tabs
            variant="underline"
            label="Разделы репозитория"
            items={[
              { id: 'code', label: 'Код' },
              {
                id: 'issues',
                label: (
                  <>
                    Задачи <Badge>12</Badge>
                  </>
                ),
              },
              {
                id: 'pulls',
                label: (
                  <>
                    Пул-реквесты <Badge>3</Badge>
                  </>
                ),
              },
              { id: 'actions', label: 'Действия' },
              { id: 'security', label: 'Безопасность' },
              { id: 'insights', label: 'Аналитика' },
            ]}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 288px',
              gap: 'var(--tb-space-8)',
              alignItems: 'start',
            }}
          >
            <Stack gap="4">
              <Stack direction="row" gap="2" align="center" justify="between" wrap>
                <Stack direction="row" gap="2" align="center">
                  <Button size="s" variant="secondary" iconLeft="branch">
                    main
                  </Button>
                  <Button size="s" variant="secondary">
                    Ветки
                  </Button>
                  <Button size="s" variant="secondary">
                    Теги
                  </Button>
                </Stack>
                <Stack direction="row" gap="2" align="center">
                  <Button size="s" variant="secondary">
                    Перейти к файлу
                  </Button>
                  <Button size="s" variant="secondary" iconLeft="plus">
                    Добавить
                  </Button>
                  <Button size="s" iconLeft="code">
                    Код
                  </Button>
                </Stack>
              </Stack>
              <Table
                columns={fileColumns}
                rows={repoFiles}
                rowKey={(row) => row.id}
                density="s"
                caption="Файлы репозитория"
              />
              <Card>
                <CardBody>
                  <Stack gap="3">
                    <Stack direction="row" gap="2" align="center">
                      <Icon name="file" size={16} />
                      <Text as="span" size="s" weight="medium">
                        README.md
                      </Text>
                    </Stack>
                    <Heading level={3}>Juce UI</Heading>
                    <Text size="s" tone="secondary">
                      Библиотека растёт не числом компонентов, а числом надёжных примитивов: одна
                      карточка, одна таблица, один рендер ссылки.
                    </Text>
                    <Text size="s" href="#" variant="hover">
                      Читать документацию
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </Stack>
            <Stack gap="6">
              <Stack gap="2">
                <Heading level={3}>О репозитории</Heading>
                <Text size="s" tone="secondary">
                  Компоненты, токены и правила, на которых собираются продукты платформы.
                </Text>
                <Text size="s" href="#" variant="hover">
                  docs.juce.dev
                </Text>
              </Stack>
              <Stack gap="2">
                <Text size="s" weight="medium">
                  Темы
                </Text>
                <Stack direction="row" gap="2" wrap>
                  {repoTopics.map((topic) => (
                    <Badge key={topic} tone="accent">
                      {topic}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
              <Stack gap="2">
                <Text size="s" weight="medium">
                  Ресурсы
                </Text>
                <Text size="s" href="#" variant="hover">
                  Readme
                </Text>
                <Text size="s" href="#" variant="hover">
                  Лицензия MIT
                </Text>
              </Stack>
              <Divider />
              <Stack gap="2">
                <Stack direction="row" gap="2" align="center">
                  <Icon name="star" size={16} />
                  <Text size="s">2 431 звезда</Text>
                </Stack>
                <Stack direction="row" gap="2" align="center">
                  <Icon name="eye" size={16} />
                  <Text size="s">128 наблюдают</Text>
                </Stack>
                <Stack direction="row" gap="2" align="center">
                  <Icon name="fork" size={16} />
                  <Text size="s">312 форков</Text>
                </Stack>
              </Stack>
            </Stack>
          </div>
        </Stack>
      </PageContent>
    </Page>
  ),
};

interface IssueRow {
  id: string;
  number: number;
  title: string;
  labels: string[];
  author: string;
  opened: string;
  closed?: boolean;
}

const issueLabelTone: Record<string, BadgeTone> = {
  баг: 'error',
  ui: 'accent',
  форма: 'warning',
  дизайн: 'success',
  таблица: 'neutral',
};

const issueRows: IssueRow[] = [
  {
    id: 'i1',
    number: 128,
    title: 'Shimmer теряет высоту при смене значения',
    labels: ['баг', 'ui'],
    author: 'Анна Ковалёва',
    opened: '2 дня назад',
  },
  {
    id: 'i2',
    number: 124,
    title: 'Callout: действие должно стоять справа снизу',
    labels: ['форма', 'дизайн'],
    author: 'Илья Петров',
    opened: '3 дня назад',
  },
  {
    id: 'i3',
    number: 119,
    title: 'Table: не работает фильтр в узловой колонке',
    labels: ['таблица'],
    author: 'Марк Ли',
    opened: 'неделю назад',
    closed: true,
  },
];

export const IssuesPage: Story = {
  name: 'Issues',
  render: () => (
    <Page>
      <PageHeader
        title="Задачи"
        description="Открытые задачи репозитория juce-ui."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'juce', href: '#' },
              { label: 'juce-ui', href: '#' },
              { label: 'Задачи' },
            ]}
          />
        }
        actions={<Button size="s">Новая задача</Button>}
      />
      <PageContent>
        <Stack gap="4">
          <Stack direction="row" gap="2" align="center" wrap>
            <div style={{ width: 280 }}>
              <Input placeholder="Поиск задач" size="s" />
            </div>
            <Button size="s" variant="secondary" iconLeft="tag">
              Метки
            </Button>
            <Button size="s" variant="secondary">
              Вехи
            </Button>
            <Button size="s" variant="secondary">
              Автор
            </Button>
          </Stack>
          <Tabs
            variant="underline"
            label="Состояние задач"
            items={[
              {
                id: 'open',
                label: (
                  <>
                    Открытые <Badge>12</Badge>
                  </>
                ),
              },
              {
                id: 'closed',
                label: (
                  <>
                    Закрытые <Badge>340</Badge>
                  </>
                ),
              },
            ]}
          />
          <List divided>
            {issueRows.map((issue) => (
              <ListRow
                key={issue.id}
                leading={<Icon name={issue.closed ? 'checkCircle' : 'issue'} size={18} />}
                title={
                  <Text as="a" href="#" variant="hover" tone="primary">
                    {issue.title}
                  </Text>
                }
                description={
                  <Stack as="span" direction="row" gap="2" wrap>
                    {issue.labels.map((label) => (
                      <Badge key={label} tone={issueLabelTone[label] ?? 'neutral'}>
                        {label}
                      </Badge>
                    ))}
                  </Stack>
                }
                meta={`#${issue.number} · ${issue.author} · ${issue.opened}`}
              />
            ))}
          </List>
        </Stack>
      </PageContent>
    </Page>
  ),
};

type CheckState = 'success' | 'failure' | 'running';

interface CheckRow {
  id: string;
  name: string;
  description: string;
  state: CheckState;
  duration: string;
}

const checkIcon: Record<CheckState, IconName> = {
  success: 'checkCircle',
  failure: 'alertCircle',
  running: 'clock',
};

const checkColor: Record<CheckState, string> = {
  success: 'var(--tb-success)',
  failure: 'var(--tb-error)',
  running: 'var(--tb-warning-text)',
};

const checks: CheckRow[] = [
  {
    id: 'build',
    name: 'build (ubuntu-latest)',
    description: 'Успешно · 1 мин 20 с',
    state: 'success',
    duration: '1 мин 20 с',
  },
  {
    id: 'test',
    name: 'test (node 20)',
    description: 'Успешно · 296 тестов, 636 проверок',
    state: 'success',
    duration: '48 с',
  },
  {
    id: 'lint',
    name: 'lint',
    description: 'Упало на правиле ast-grep',
    state: 'failure',
    duration: '42 с',
  },
  {
    id: 'e2e',
    name: 'e2e (storybook)',
    description: 'Идёт · 45 с из 3 мин',
    state: 'running',
    duration: '3 мин',
  },
];

interface SlowTest {
  id: string;
  name: string;
  file: string;
  time: string;
  state: CheckState;
}

const slowTests: SlowTest[] = [
  {
    id: 't1',
    name: 'рендерит таблицу с фильтрами',
    file: 'Table.test.tsx',
    time: '2,4 с',
    state: 'success',
  },
  {
    id: 't2',
    name: 'переключает табы стрелками',
    file: 'Navigation.test.tsx',
    time: '1,1 с',
    state: 'success',
  },
  {
    id: 't3',
    name: 'шоускейс GitHub-раскладки',
    file: 'Page.test.tsx',
    time: '900 мс',
    state: 'running',
  },
];

const slowTestColumns: TableColumn<SlowTest>[] = [
  { id: 'name', kind: 'value', header: 'Тест', value: (row) => row.name },
  { id: 'file', kind: 'value', header: 'Файл', value: (row) => row.file },
  {
    id: 'state',
    kind: 'node',
    header: 'Статус',
    cell: (row) => (
      <Badge
        tone={row.state === 'success' ? 'success' : row.state === 'failure' ? 'error' : 'neutral'}
      >
        {row.state === 'success' ? 'Прошёл' : row.state === 'failure' ? 'Упал' : 'Идёт'}
      </Badge>
    ),
  },
  { id: 'time', kind: 'value', header: 'Время', align: 'end', value: (row) => row.time },
];

export const TestsPage: Story = {
  name: 'Tests',
  render: () => (
    <Page>
      <PageHeader
        title="Тесты"
        description="Прогон для ветки main · 24 проверки."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: 'juce', href: '#' },
              { label: 'juce-ui', href: '#' },
              { label: 'Тесты' },
            ]}
          />
        }
        actions={
          <Button size="s" variant="secondary" iconLeft="refresh">
            Перезапустить
          </Button>
        }
      />
      <PageContent>
        <Stack gap="8">
          <DescriptionList
            columns={4}
            items={[
              { label: 'Всего', value: '24' },
              { label: 'Прошли', value: '22' },
              { label: 'Упали', value: '1' },
              { label: 'Идут', value: '1' },
            ]}
          />
          <Section
            title="Задания"
            description="Проверки из workflow ci.yml"
            actions={
              <Text size="s" href="#" variant="hover">
                Открыть лог
              </Text>
            }
          >
            <List divided>
              {checks.map((check) => (
                <ListRow
                  key={check.id}
                  leading={
                    <Icon
                      name={checkIcon[check.state]}
                      size={18}
                      style={{ color: checkColor[check.state] }}
                    />
                  }
                  title={check.name}
                  description={check.description}
                  trailing={
                    <Text size="s" tone="secondary">
                      {check.duration}
                    </Text>
                  }
                />
              ))}
            </List>
          </Section>
          <Section title="Медленные тесты" description="Дольше секунды в этом прогоне">
            <Table
              columns={slowTestColumns}
              rows={slowTests}
              rowKey={(row) => row.id}
              density="s"
              caption="Медленные тесты"
            />
          </Section>
        </Stack>
      </PageContent>
    </Page>
  ),
};

interface PinnedRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: string;
}

const pinnedRepos: PinnedRepo[] = [
  {
    id: 'juce',
    name: 'juce-ui',
    description: 'React UI-кит на токенах: примитивы, компоненты и правила.',
    language: 'TypeScript',
    stars: '2 431',
  },
  {
    id: 'gobellim',
    name: 'gobellim',
    description: 'Научная платформа университета: курсы, задачи и проверки.',
    language: 'Go',
    stars: '342',
  },
  {
    id: 'spillety',
    name: 'spillety',
    description: 'Сервис коротких заметок с поиском по смыслу.',
    language: 'Kotlin',
    stars: '96',
  },
  {
    id: 'trajectory',
    name: 'trajectory-university',
    description: 'Портал траекторий обучения и карьерных треков.',
    language: 'TypeScript',
    stars: '54',
  },
];

const languageColor: Record<string, string> = {
  TypeScript: 'var(--tb-accent-text)',
  Go: 'var(--tb-success)',
  Kotlin: 'var(--tb-warning)',
};
