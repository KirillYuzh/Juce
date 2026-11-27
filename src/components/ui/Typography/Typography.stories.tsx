import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Callout,
  Heading,
  InlineCode,
  ListItem,
  OrderedList,
  Quote,
  Text,
  UnorderedList,
} from './Typography';

const meta: Meta = {
  title: 'Primitives/Typography',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 560 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Heading level={1}>Заголовок первого уровня</Heading>
        <Heading level={2}>Заголовок второго уровня</Heading>
        <Heading level={3}>Заголовок третьего уровня</Heading>
        <Heading level={4}>Заголовок четвёртого уровня</Heading>
        <Heading level={5}>Заголовок пятого уровня</Heading>
        <Heading level={6}>Заголовок шестого уровня</Heading>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text size="xl">Основной текст размера xl.</Text>
        <Text size="l">Основной текст размера l.</Text>
        <Text>Основной текст размера m.</Text>
        <Text size="s" tone="secondary">
          Вторичный текст размера s.
        </Text>
        <Text size="xs" tone="tertiary">
          Третичный текст размера xs.
        </Text>
        <Text tone="muted" weight="medium">
          Приглушённый текст со средним начертанием.
        </Text>
        <Text tone="error" weight="bold">
          Текст ошибки.
        </Text>
        <Text href="#docs">Текст-ссылка.</Text>
      </div>

      <Quote cite="Команда Juce">
        Библиотека растёт не числом компонентов, а числом надёжных примитивов.
      </Quote>

      <Callout tone="note" title="Заметка">
        Токены цвета берутся из ролей, литералов в компонентах нет.
      </Callout>
      <Callout tone="important" title="Важно">
        Один вид — один компонент: вторая карточка или второй Button не появляется.
      </Callout>
      <Callout tone="warning" title="Предупреждение">
        Сторонняя библиотека живёт только в примерах Patterns.
      </Callout>
      <Callout tone="error" title="Ошибка" action={{ label: 'Повторить', onClick: () => {} }}>
        Сборка упала на проверке типов.
      </Callout>
      <Callout tone="success" title="Готово">
        Все проверки прошли.
      </Callout>

      <OrderedList>
        <ListItem>Прочитать контракт компонента.</ListItem>
        <ListItem>Собрать из существующих примитивов.</ListItem>
        <ListItem>Добавить тест и историю.</ListItem>
      </OrderedList>

      <UnorderedList>
        <ListItem>Цвет — только ролью.</ListItem>
        <ListItem>Радиус — только токеном.</ListItem>
        <ListItem>Движение — только длительностью из токенов.</ListItem>
      </UnorderedList>

      <Text>
        Проверка запускается командой <InlineCode>npm run check</InlineCode>.
      </Text>
    </div>
  ),
};
