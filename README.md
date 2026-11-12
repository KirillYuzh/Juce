# juce-ui — UI-кит «Джус»

React-библиотека компонентов и шаблонов «Джус» и её ИИ-ассистента Джупсика. Всё живёт в Storybook: токены, примитивы, AI-элементы, блоки, секции и три готовые страницы.

## Запуск

```bash
npm install
npm run storybook        # Storybook на http://localhost:6006
npm run dev              # демо: главная и /#/assistant
npm run build            # проверка типов + production-сборка демо
npm run build:lib        # сборка npm-пакета в dist/
npm run build-storybook
```

## Установка как пакета

```bash
npm i juce-ui                 # из реестра (после публикации)
npm i github:KirillYuzh/Juce#develop   # напрямую из ветки
```

```tsx
import { Button, Chat, PromptInput } from 'juce-ui';
import 'juce-ui/styles.css';

export function App() {
  return <Button>Начать разбор</Button>;
}
```

Пакет собирается при установке (`prepare` → `build:lib`), поэтому из git ставится из ветки `develop`. React и React DOM — peer-зависимости (`>=18`), в бандл не попадают. Стили, шрифты и CSS Modules приезжают одним файлом `styles.css`, ассеты шрифтов лежат рядом в `dist/assets`.

## Темы

В пакете две готовые темы: светлая (по умолчанию) и тёмная. Переключаются атрибутом
`data-theme` на любом контейнере (обычно `<html>`) или классом `.dark`:

```ts
document.documentElement.dataset.theme = 'dark'; // 'light' — обратно
```

`data-theme="light"` на вложенном контейнере возвращает светлую тему внутри тёмной.
Имена токенов в обеих темах одинаковые, компоненты менять не нужно.

Системная тема (пакет сам её не навязывает):

```ts
const mq = matchMedia('(prefers-color-scheme: dark)');
const apply = () => {
  document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light';
};
mq.addEventListener('change', apply);
apply();
```

### Свои цвета

Публичный контракт — переменные `--tb-*`. Палитра (`--ink`, `--mist`, `--coral`,
`--bg`, `--gray-*`) внутренняя: переопределяйте роли, а не её.

```css
@import 'juce-ui/styles.css';

:root {
  --tb-primary: #0f4c81;
  --tb-primary-hover: #0c3f6c;
  --tb-on-primary: #ffffff;
  --tb-accent: #ff8a3d;
  --tb-accent-text: #b34700;
  --tb-on-accent: #222526;
  --tb-text-link: #0f4c81;
}

/* тёмная тема — те же роли, свои значения */
[data-theme='dark'] {
  --tb-primary: #cfe3f5;
  --tb-primary-hover: #b9d5ee;
  --tb-on-primary: #0b1a26;
  --tb-accent: #ffb27a;
  --tb-accent-text: #ffc39a;
  --tb-on-accent: #0b1a26;
  --tb-text-link: #8cc0ff;
}
```

Правило простое: `--tb-primary` — сильная нейтральная заливка, `--tb-on-primary` —
подпись на ней; `--tb-accent` — коралловая заливка, `--tb-accent-text` — тот же
акцент как текст. В тёмной теме заливки светлее, подписи темнее.

### Своя тема

Скопируйте блок токенов из `src/styles/tokens.css` (`:root` — светлая тема,
`[data-theme='dark']` — тёмная), поменяйте значения и дайте теме имя:

```css
[data-theme='ocean'] {
  --tb-bg: #0b1a26;
  --tb-surface: #102431;
  --tb-text-primary: #e6f1f8;
  /* ...остальные --tb-* роли */
}
```

```ts
document.documentElement.dataset.theme = 'ocean';
```

Минимум, который стоит задать: `--tb-bg`, `--tb-surface`, `--tb-bg-secondary`,
`--tb-bg-tertiary`, `--tb-text-primary/secondary/tertiary`, `--tb-primary` (+ hover,
active, on-primary), `--tb-secondary` (+ hover), `--tb-accent` (+ hover, soft, text,
on-accent), `--tb-success/error/warning` (+ text и soft), `--tb-border`,
`--tb-border-strong`, `--tb-field`, `--tb-shadow-*`.

Проверка контраста: пары «текст × реальная поверхность» должны проходить WCAG AA
(4.5:1 для текста, 3:1 для границ) и APCA Lc ≥ 60 для основного текста. В тёмной
теме не берите чистый чёрный фон и чистый белый текст — берите подтон нейтрали
светлой темы и ≈ 91 % белого для основного текста.

## Структура Storybook

`Foundations/Tokens`: цвета, типографика, отступы, иконки.

`Primitives`: Button, IconButton, TextLink, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Chip, Avatar, Progress, Spinner, Skeleton, Divider, Logo, Icon, Alert, Tooltip, CookieNotice, Tabs, Accordion, Collapsible, Hover card, Date picker, Code block, Carousel, Questionnaire, Sidebar, Resizable.

`Utilities`: scroll-fade и shimmer, чистый CSS без JS.

`AI`: Message, Message scroller, Prompt input, Chat, Markdown, Task, Trace, Sources, Stack trace, Reasoning, Inline citation, Suggestions.

Ответы в `Chat` рендерятся как Markdown (`react-markdown` + `remark-gfm`): заголовки, списки, таблицы, цитаты и блоки кода. Отдельный `<Markdown>` можно использовать где угодно, `streaming` показывает каретку в конце недосказанного ответа.

`Blocks`: Header, Footer, QuickLinks, ProductCard, PromoCard, TextCard, StatPanel, WideBanner, DirectionCard, ValuesGrid, StartCards, VacancyCards.

`Templates/Sections`: готовые секции страниц, которые можно собирать в любом порядке.

`Templates/Pages`: `Home`, `Researchers`, `Assistant` — целые страницы с хедером и футером.

## Слои

```
src/
  styles/        токены, шрифты, базовая типографика, утилиты
  components/ui/ примитивы и их stories
  components/ai/ чат и AI-элементы
  components/blocks/ блоки страниц
  sections/      секции-обёртки с заголовками
  pages/         шаблоны страниц
  lib/           чистые функции без React (работа с датами)
  data/          тексты и ссылки страниц
```

Все стили на CSS Modules и переменных из `src/styles/tokens.css`. Две темы — светлая и тёмная — на одних и тех же токенах `--tb-*`. Светлая палитра: графитовый primary `#222526`, secondary `#ccdcef`, коралловый accent `#ff6574`. Текст `rgba(0,0,0,.8)`, радиус карточек 24px, кнопок 12px, контейнер 1152px с полями 24px, хедер 64px.

## Шрифты

Manrope — база интерфейса и заголовков, Linux Libertine — цитаты и длинный научный текст, JetBrains Mono — код, стек-трейсы и номера строк. Токены: `--tb-font-text`, `--tb-font-heading`, `--tb-font-quote`, `--tb-font-mono`. Файлы лежат в `src/assets/fonts` и собираются в `dist/assets`, поэтому работают и в демо, и в пакете.

## Иконки

Ant Design Icons (MIT). Данные лежат снапшотом в `src/components/ui/icons.ts`, runtime-зависимости нет: чтобы добавить иконку, допишите пару `имя: [путь]` из `@ant-design/icons-svg` или [shadcn.io/icons](https://www.shadcn.io/icons/ant-design). VK и Odnoklassniki в Ant Design отсутствуют и остались собственными путями.

## Графика

Все карточки, баннеры и hero-блоки используют один файл — `public/image.png`: дизерингованный снимок в брендовых цветах (coral + graphite). Остальные фотографии остаются в `public/images/wang` как исходники, но в компонентах не используются.

## Проверки

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run build
npm run build:lib
npm run build-storybook
```

## Лицензии

Код — MIT.
Ant Design Icons — MIT.
Manrope — OFL.
JetBrains Mono — OFL.
Linux Libertine — GPL-2.0 с font exception, дополнительно OFL.
