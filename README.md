# Джус — UI-кит платформы научных исследований

React-библиотека компонентов и шаблонов «Джус» и её ИИ-ассистента Джупсика. Всё живёт в Storybook: токены, примитивы, AI-элементы, блоки, секции и три готовые страницы.

## Запуск

```bash
npm install
npm run storybook        # Storybook на http://localhost:6006
npm run dev              # демо: /#/researchers и /#/assistant
npm run build            # проверка типов + production-сборка демо
npm run build:lib        # сборка npm-пакета в dist/
npm run build-storybook
```

## Установка как пакета

```bash
npm i github:KirillYuzh/Juce#develop
```

```tsx
import { Button, Chat, PromptInput } from 'juce-ui';
import 'juce-ui/styles.css';

export function App() {
  return <Button>Начать исследование</Button>;
}
```

Пакет собирается при установке (`prepare` → `build:lib`), поэтому из git ставится из ветки `develop`. React и React DOM — peer-зависимости (`>=18`), в бандл не попадают. Стили, шрифты и CSS Modules приезжают одним файлом `styles.css`, ассеты шрифтов лежат рядом в `dist/assets`.

## Структура Storybook

`Foundations/Tokens`: цвета, типографика, отступы, иконки.

`Primitives`: Button, IconButton, TextLink, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Chip, Avatar, Progress, Spinner, Skeleton, Divider, Logo, Icon, Alert, Tooltip, CookieNotice, Tabs, Accordion, Collapsible, Hover card, Date picker, Code block.

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

Все стили на CSS Modules и переменных из `src/styles/tokens.css`. Палитра: графитовый primary `#222526`, secondary `#ccdcef`, коралловый accent `#ff6574`. Текст `rgba(0,0,0,.8)`, радиус карточек 24px, кнопок 12px, контейнер 1152px с полями 24px, хедер 64px.

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
