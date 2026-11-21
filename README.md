# juce-ui

React-библиотека компонентов и шаблонов Джус и её ИИ-ассистента Джупсика.

## Установка как пакета

```bash
npm i juce-ui
# или
npm i github:KirillYuzh/Juce#develop
```

```tsx
import { Button, Chat, PromptInput } from 'juce-ui';
import 'juce-ui/styles.css';

export function App() {
  return <Button>Начать разбор</Button>;
}
```

## Темы

В пакете две готовые темы: светлая ('light', по умолчанию) и тёмная ('dark'). Переключаются атрибутом
`data-theme` на любом контейнере (обычно `<html>`) или классом `.dark`:

```ts
document.documentElement.dataset.theme = 'dark';
```

`data-theme="light"` на вложенном контейнере возвращает светлую тему внутри тёмной.
Имена токенов в обеих темах одинаковые, компоненты менять не нужно.

Системная тема:

```ts
const mq = matchMedia('(prefers-color-scheme: dark)');
const apply = () => {
  document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light';
};
mq.addEventListener('change', apply);
apply();
```

## Стили

| Шрифт           | Домен                           | Лицензия |
| --------------- | ------------------------------- | -------- |
| Manrope         | база интерфейса и заголовков    | OFL      |
| Linux Libertine | цитаты и длинный научный текст  | OFL      |
| JetBrains Mono  | код, стек-трейсы и номера строк | GPL-2.0  |

| Цвет      | Hex     | HSLA   |
| --------- | ------- | ------ |
| primary   | #222526 | hsla() |
| secondary | #ccdcef | hsla() |
| accent    | #ff6574 | hsla() |

#### Своя тема

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

## Лицензии

|                  | Лицензия                                    |
| ---------------- | ------------------------------------------- |
| Код              | MIT                                         |
| Ant Design Icons | MIT                                         |
| Manrope          | OFL                                         |
| JetBrains Mono   | OFL                                         |
| Linux Libertine  | GPL-2.0 с font exception, дополнительно OFL |
