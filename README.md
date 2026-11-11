# T-Bank UI Kit

React-библиотека компонентов и шаблонов страниц, собранная по публичным страницам [tbank.ru](https://www.tbank.ru/) и [tbank.ru/career](https://www.tbank.ru/career/). Всё живёт в Storybook: примитивы, блоки, секции и две готовые страницы.

## Запуск

```bash
npm install
npm run storybook     # Storybook на http://localhost:6006
npm run dev           # демо-приложение на http://localhost:5173, /#/career для карьерной страницы
npm run build         # проверка типов + production-сборка демо
npm run build-storybook
```

## Карта источников

| Источник                       | Локальная страница       | Файл                       |
| ------------------------------ | ------------------------ | -------------------------- |
| `https://www.tbank.ru/`        | `Templates/Pages/Home`   | `src/pages/HomePage.tsx`   |
| `https://www.tbank.ru/career/` | `Templates/Pages/Career` | `src/pages/CareerPage.tsx` |

Вспомогательные материалы: замеры, порядок секций и карта ассетов в `docs/research/tbank/brief.md`. Скриншоты источника и локальной сборки в `docs/research/tbank/screens/`.

## Структура Storybook

`Foundations/Tokens`: цвета, типографика, отступы, иконки.

`Primitives`: Button, IconButton, TextLink, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Chip, Avatar, Progress, Spinner, Skeleton, Divider, Logo, Icon, Alert, Tooltip, CookieNotice, Tabs, Accordion, Collapsible, Hover card, Date picker, Code block.

`Utilities`: scroll-fade и shimmer, чистый CSS без JS.

`AI`: Message, Message scroller, Prompt input, Chat, Task, Trace, Sources, Stack trace, Reasoning, Inline citation, Suggestions.

`Blocks`: Header, Footer, QuickLinks, ProductCard, PromoCard, TextCard, StatPanel, WideBanner, ProductShowcase, DirectionCard, ValuesGrid, Awards, StartCards.

`Templates/Sections`: готовые секции страниц, которые можно собирать в любом порядке.

`Templates/Pages`: целые страницы с хедером, контентом, футером и куки-баннером.

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
  data/          тексты и ссылки, снятые с источника
```

Все стили на CSS Modules и переменных из `src/styles/tokens.css`. Палитра: графитовый primary `#222526`, secondary `#ccdcef`, коралловый accent `#ff6574`. Текст `rgba(0,0,0,.8)`, радиус карточек 24px, кнопок 12px, контейнер 1152px с полями 24px, хедер 64px.

Шрифты лежат в `public/fonts` и разбиты на subsets: Manrope (кириллица, латиница, latin-ext) — база интерфейса и заголовков, Linux Libertine — цитаты и длинный научный текст, JetBrains Mono — код, стек-трейсы и номера строк. Токены: `--tb-font-text` и `--tb-font-heading` (Manrope), `--tb-font-quote`, `--tb-font-mono`. Живые образцы в `Foundations/Tokens/Typography`.

Manrope и JetBrains Mono распространяются под OFL, взяты subset-файлами с Google Fonts. Linux Libertine — GPL-2.0 с font exception, дополнительно OFL; OTF с CTAN сжат в woff2. Локальные изображения и 3D-иконки в `public/images/tbank`, имена папок повторяют секции.

Иконки — Ant Design Icons (MIT). Данные лежат снапшотом в `src/components/ui/icons.ts`, runtime-зависимости нет: чтобы добавить иконку, допишите пару `имя: [путь]` из `@ant-design/icons-svg` или [shadcn.io/icons](https://www.shadcn.io/icons/ant-design). VK и Odnoklassniki в Ant Design отсутствуют и остались собственными путями.

## AI-элементы и утилиты

Набор `src/components/ai` повторяет состав и API shadcn/ui, но написан с нуля под этот кит: CSS Modules на общих токенах, русские тексты, свои иконки и aria. Ни одна зависимость shadcn не подключена.

Поведение вынесено в headless-примитивы, поверх которых собраны готовые элементы:

- `Collapsible` — `open`/`defaultOpen`/`onOpenChange`, `aria-expanded`/`aria-controls`, `keepMounted` для содержимого, которое должно остаться в DOM.
- `HoverCard` — задержки открытия и закрытия, Escape, закрытие при уходе фокуса, вложенные интерактивные элементы доступны с клавиатуры.
- `Popover` — позиционирование от триггера, закрытие по Escape и клику мимо.
- `MessageScroller` — `Provider`/`Root`/`Viewport`/`Content`/`Item`/`Button`, автоскролл только пока читатель внизу, сохранение позиции при подгрузке старых сообщений, хуки `useMessageScroller`, `useMessageScrollerScrollable`, `useMessageScrollerVisibility`.
- `CodeBlock` — свой регулярный токенизатор на js/ts/tsx/jsx/json/css/html/bash и diff-строки, без highlight.js и prism.
- `DatePicker` — календарь и пресеты периодов на `Date` из `src/lib/date.ts`, без date-fns.

Утилиты лежат в `src/styles/utilities.css` и подключаются классами:

| Класс                        | Что делает                                                        |
| ---------------------------- | ----------------------------------------------------------------- |
| `.tb-scroll-fade-y`          | вертикальные mask-fade по краям, сила зависит от прокрутки        |
| `.tb-scroll-fade-x`          | то же по горизонтали, для лент чипов                              |
| `.tb-scroll-fade-t/-b/-l/-r` | fade только с одной стороны                                       |
| `.tb-scroll-fade-none`       | отключает маску                                                   |
| `.tb-shimmer`                | блик по тексту для «печатает…», есть `-once`, `-reverse`, `-none` |

Fade работает на scroll-driven animation с `@property`: смещения краёв — зарегистрированные `<length>`, поэтому анимация может их интерполировать. Слушателей прокрутки нет. В браузерах без `animation-timeline` срабатывает `@supports not`: края затенены статично, содержимое доступно. При `prefers-reduced-motion` блик отключается, текст остаётся обычным.

Размер фейда настраивается через `--tb-sf-size` (по умолчанию 40px), длина перехода — `--tb-sf-reveal` (96px). Только длины: процент в этих переменных ломает интерполяцию.

## Проверки

```bash
npx tsc -b
npm run build
npm run build-storybook
```

Сборка Storybook проходит, страницы рендерятся без ошибок в консоли. Сравнение с источником делалось на 1440px и 390px, скриншоты в `docs/research/tbank/screens/`.

## Что осталось за рамками

Мобильный текст hero на career-странице у источника короче десктопного; здесь используется один вариант текста.

Футер home сокращён по количеству ссылок и юридических абзацев: структура и стили совпадают, полный список ссылок источника не переносился.

Табы «Кредитная карта» и «Вклад» в блоке оформления меняют заголовок и набор полей, но используют ту же форму, что и дебетовая карта. У источника это отдельные формы.

Логотип Forbes на жёлтом баннере набран текстом Georgia, а не фирменным логотипом.

Фотографии и 3D-ассеты принадлежат Т-Банку и скачаны с публичных CDN только для демонстрации компонентов. Для реального использования нужны собственные ассеты. Часть иллюстраций осталась в исходных цветах, у hero, карточек направлений и ценностей жёлтый сдвинут в коралловый фильтром.
