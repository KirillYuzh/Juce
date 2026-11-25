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

Цвет и форма — независимые оси:

| Ось   | Атрибут      | Что задаёт                                                 | Значения                                                                |
| ----- | ------------ | ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| Цвет  | `data-theme` | цветовые роли `--tb-*` и `color-scheme`                    | `light` (по умолчанию), `dark`, `palette-wasabi`, `palette-wasabi-dark` |
| Форма | `data-skin`  | радиусы `--tb-radius-*`, фон поверхности, отключение теней | `default` (по умолчанию), `blueprint`                                   |

Оси не связаны: `blueprint` есть и в светлой, и в тёмной теме. Атрибуты ставятся на любой контейнер, обычно на `<html>`:

```ts
document.documentElement.dataset.theme = 'palette-wasabi-dark';
document.documentElement.dataset.skin = 'blueprint';
```

Контейнер с атрибутами — это scope: он красит свою поверхность и сбрасывает обе оси целиком. Поэтому две половины страницы могут жить в разных темах:

```tsx
import { ThemeScope } from 'juce-ui';

export function Split() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <ThemeScope theme="light" skin="default">
        <Preview />
      </ThemeScope>
      <ThemeScope theme="palette-wasabi-dark" skin="blueprint">
        <Preview />
      </ThemeScope>
    </div>
  );
}
```

`ThemeScope` всегда ставит `data-theme` и `data-skin` (для default — `default`), поэтому вложенный блок сбрасывает и цвет, и форму. Класс `.dark` удалён: тёмная тема задаётся только `data-theme="dark"`.

Системная тема:

```ts
const mq = matchMedia('(prefers-color-scheme: dark)');
const apply = () => {
  document.documentElement.dataset.theme = mq.matches ? 'dark' : 'light';
};
mq.addEventListener('change', apply);
apply();
```

### Своя тема

Тема — один блок цветовых ролей. Палитры `palette-*` собирает генератор `scripts/gen-themes.mjs` в `src/styles/themes.css` и `src/styles/themes.ts`; свою тему можно положить рядом руками:

```css
[data-theme='ocean'] {
  color-scheme: light;
  --tb-bg: #0b1a26;
  --tb-surface: #102431;
  --tb-text-primary: #e6f1f8;
  /* остальные цветовые роли: тексты, действия, статусы, границы, данные */
}
```

```ts
document.documentElement.dataset.theme = 'ocean';
```

Блок обязан объявить весь цветовой набор: тест токенов назовёт пропущенные роли. Радиусы — ось скина. Тени задаёт тема (у `dark` свои значения), а скин может их отключить; минимальный набор темы включает `--tb-shadow-*`.

### Свой скин

Скин — один блок структурных ролей. Цвет он не задаёт и работает с любой темой:

```css
[data-skin='sharp'] {
  --tb-radius-control: 4px;
  --tb-radius-surface: 8px;
  --tb-radius-popover: 8px;
  --tb-radius-chip: 4px;
  --tb-radius-switch: 2px;
  --tb-radius-avatar: 50%;
  --tb-shadow-card: none;
}
```

```ts
document.documentElement.dataset.skin = 'sharp';
```

Скин переопределяет то, что меняет: базовую форму объявляет каждый scope, поэтому форма внешнего scope внутрь не протекает.

### Радиусы и тени

Радиусы берутся только по роли или по шагу шкалы, числа в компоненты не передаются:

- роли: `--tb-radius-control`, `--tb-radius-surface`, `--tb-radius-popover`, `--tb-radius-chip`, `--tb-radius-switch`, `--tb-radius-avatar`;
- шкала: `--tb-radius-xxs`, `--tb-radius-xs`, `--tb-radius-s`, `--tb-radius-m`, `--tb-radius-l`, `--tb-radius-pill`, `--tb-radius-circle`.

Проп `radius` принимает `'inset' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'pill'`. `inset` — радиус родителя минус его padding, с клампом от нуля.

Тени: `--tb-shadow-control`, `--tb-shadow-card`, `--tb-shadow-popover`, `--tb-shadow-modal`, `--tb-shadow-float`.

### Контраст

Тест токенов проверяет каждую тему по WCAG AA: 4.5:1 для основного, вторичного и приглушённого текста и ссылок, 3:1 для декоративного третичного текста и границы контрола. APCA — рекомендация; воротами остаётся WCAG AA из теста.

## Стили

### Шрифты

| Шрифт           | Домен                           | Лицензия |
| --------------- | ------------------------------- | -------- |
| Manrope         | база интерфейса и заголовков    | OFL      |
| Linux Libertine | цитаты и длинный научный текст  | OFL      |
| JetBrains Mono  | код, стек-трейсы и номера строк | OFL 1.1  |

Цвета живут в `src/styles/tokens.css`, формы скинов — в `src/styles/skins.css`. README не дублирует значения: единственный источник правды — токены.

## Лицензии

|                  | Лицензия                                    |
| ---------------- | ------------------------------------------- |
| Код              | MIT                                         |
| Ant Design Icons | MIT                                         |
| Manrope          | OFL                                         |
| JetBrains Mono   | OFL                                         |
| Linux Libertine  | GPL-2.0 с font exception, дополнительно OFL |
