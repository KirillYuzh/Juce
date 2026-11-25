# juce-ui

React-библиотека компонентов и шаблонов Джус и её ИИ-ассистента Джупсика.

## Установка как пакета

Пакет ESM-only (`"type": "module"`): импортируйте его из ESM или бандлера, `require('juce-ui')` не поддерживается.

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

`juce-ui/styles.css` обязателен: в нём токены, темы и стили компонентов.

Собранный бандл начинается с директивы `"use client"`, поэтому компоненты с хуками можно импортировать в React Server Components (Next App Router) без ручной обёртки.

## Темы

Цвет и `color-scheme` задаёт `data-theme`:

| Значение                                  | Что это                                         |
| ----------------------------------------- | ----------------------------------------------- |
| `light` (по умолчанию)                    | светлая                                         |
| `dark`                                    | тёмная                                          |
| `heroui`, `heroui-dark`                   | палитры HeroUI                                  |
| `ocean`, `dune`, `dusk`, `silk`, `aurora` | тёмные пресеты, `src/styles/themes-presets.css` |

Нейтрали — поверхности, текст, границы, серая шкала — объявлены один раз на режим в `src/styles/tokens.css` через `light-dark()` и не имеют оттенка. Тема задаёт только акценты: `--tb-primary*`, `--tb-accent*`, ссылки и `--tb-border-on-primary`. Так держится правило 60-30-10: цвет темы живёт в точечных деталях. Форма — одна на кит: радиусы, шрифты и движение живут в структурном блоке `src/styles/structure.css` и от цвета не зависят.

Атрибут ставится на любой контейнер, обычно на `<html>`:

```ts
document.documentElement.dataset.theme = 'ocean';
```

Контейнер с атрибутом — это scope: он красит свою поверхность. Поэтому две половины страницы могут жить в разных темах:

```tsx
import { ThemeScope } from 'juce-ui';

export function Split() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <ThemeScope theme="light">
        <Preview />
      </ThemeScope>
      <ThemeScope theme="dark">
        <Preview />
      </ThemeScope>
    </div>
  );
}
```

`ThemeScope` всегда ставит `data-theme`, поэтому вложенный блок сбрасывает цвет родителя. Класс `.dark` удалён: тёмная тема задаётся только `data-theme="dark"`.

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

Тема — один блок цветовых ролей в `src/styles/tokens.css`; список значений для переключателя и типов — `src/styles/themes.ts`. Оба файла рукописные, генератора нет — свою тему кладут рядом:

```css
[data-theme='lagoon'] {
  color-scheme: dark;
  --tb-bg: #0b1a26;
  --tb-surface: #102431;
  --tb-text-primary: #e6f1f8;
  /* остальные цветовые роли: тексты, действия, статусы, границы, данные */
}
```

```ts
document.documentElement.dataset.theme = 'lagoon';
```

Блок обязан объявить весь цветовой набор: тест токенов назовёт пропущенные роли. Радиусы, шрифты и движение — общие структурные роли в `src/styles/structure.css`. Тени задаёт тема; минимальный набор темы включает `--tb-shadow-*`.

### Радиусы и тени

Радиусы берутся только по роли или по шагу шкалы, числа в компоненты не передаются:

- роли: `--tb-radius-control`, `--tb-radius-surface`, `--tb-radius-popover`, `--tb-radius-chip`, `--tb-radius-switch`, `--tb-radius-avatar`;
- шкала: `--tb-radius-xxs`, `--tb-radius-xs`, `--tb-radius-s`, `--tb-radius-m`, `--tb-radius-l`, `--tb-radius-pill`, `--tb-radius-circle`.

Проп `radius` принимает `'inset' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'pill'`. `inset` — радиус родителя минус его padding, с клампом от нуля.

Тени: `--tb-shadow-control`, `--tb-shadow-card`, `--tb-shadow-popover`, `--tb-shadow-modal`, `--tb-shadow-float`.

### Контраст

Тест токенов проверяет каждую тему по WCAG AA: 4.5:1 для основного, вторичного и приглушённого текста и ссылок, 3:1 для декоративного третичного текста и границы контрола. APCA — рекомендация; воротами остаётся WCAG AA из теста.

## Поля

Видимая подпись поля — `placeholder`. По умолчанию он плавающий: в пустом поле стоит по центру, при фокусе и заполнении уезжает наверх. Отдельный `label` — второй вариант: статичная подпись сверху, placeholder внутри поля не уезжает.

```tsx
<Input placeholder="Название задачи" required />
<Textarea placeholder="Комментарий" />
<Input placeholder="Сообщение" required requiredMark={false} />
```

`required` сам рисует красную звёздочку рядом с подписью или placeholder, `requiredMark={false}` её убирает. Доступное имя берётся из `label`, затем `aria-label`, затем `placeholder`. Контракт — `openspec/specs/forms/spec.md`.

## Стили

### Подключение

`import 'juce-ui/styles.css'` подключает токены, утилиты и стили компонентов. Документ он не ресетит: `body`, `a`, `button`, `ul` и заголовки остаются хосту.

`import 'juce-ui/reset.css'` — опциональный нормализатор для демо и приложений без своего reset.

### Шрифты

| Шрифт           | Домен                           | Лицензия                         |
| --------------- | ------------------------------- | -------------------------------- |
| Manrope         | база интерфейса и заголовков    | OFL                              |
| Linux Libertine | цитаты и длинный научный текст  | OFL или GPL-2.0 с font exception |
| JetBrains Mono  | код, стек-трейсы и номера строк | OFL 1.1                          |

Цвет и темы живут в `src/styles/tokens.css`, тёмные пресеты — в `src/styles/themes-presets.css`, структурные роли (радиусы, шрифты, движение) — в `src/styles/structure.css`. README не дублирует значения: единственный источник правды — токены.

### Движение

Длительности — `--tb-duration-fast|base|slow`, кривые — `--tb-ease-standard`. `transition` перечисляет свойства явно (без `all`) и берёт значения только из токенов.

`prefers-reduced-motion: reduce` обрабатывается один раз в `src/styles/motion.css`: переходы схлопываются, декоративные анимации отключаются, индикаторы с классом `tb-motion-essential` продолжают вращаться. Меняются только токены `--tb-duration-*` и классы `tb-motion-*`, остальной документ не затрагивается. Компоненты свой блок `prefers-reduced-motion` не объявляют — за этим следит `npm run lint:css`.

## Patterns

Storybook `Patterns` — сочетания примитивов: как готовые компоненты собираются в экран, без нового API. В `storySort` раздел стоит после `Primitives`.

| Раздел                                 | Что внутри                                                                                                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Patterns/Layout`                      | форма, настройки, поиск с фильтрами, пустое состояние, список сущностей, уведомление                                                                                                                                     |
| `Patterns/Using other libs/react-bits` | фоны `HoloMosaic`, `NeonGlyphs`, `GradientASCII`, `GhostFibers`, `Topography`, `SideRays`, `AeroShards`; компоненты `TechText`, `ElectricLogo`, `SpecularButton`, `ProfileCard`, `PixelCard`, `SwipeRow`, `TargetCursor` |
| `Patterns/Using other libs/reactflow`  | граф на React Flow, покрашенный токенами темы                                                                                                                                                                            |
| `Patterns/Using other libs/antv`       | графы на X6, покрашенные токенами темы                                                                                                                                                                                   |
| `Patterns/Using other libs/jointjs`    | графы на JointJS, покрашенные токенами темы                                                                                                                                                                              |

Сторонние библиотеки в `Patterns/Using other libs` вызываются напрямую, без обёрток. Фоны react-bits рисуют в canvas/WebGL и не понимают `var()`, поэтому сторис читает `--tb-bg`, `--tb-text-primary` и `--tb-accent` через `getComputedStyle`, передаёт вычисленные значения в цветовые пропсы и пересчитывает их при смене `data-theme`. Поверх фона и под контентом — скрим из `--tb-bg`, чтобы текст оставался читаемым. `AeroShards` единственный требует WebGPU и devDependency `vgpu`; без WebGPU фон просто не рисуется.

Компоненты react-bits применяются к нашим компонентам: `PixelCard` стоит в `media` у `DetailCard`, `ProfileCard` лежит поверх нашей карточки, `SwipeRow` получает наш контент, `TargetCursor` работает над нашими кнопками, `ElectricLogo` рисует наш логотип. Цвета темы передаются теми же hex-пропсами, что и у фонов. Вендорный CSS в `src/patterns/using-other-libs` — исходники библиотек, поэтому CSS-правила кита (hover, токены движения, ветвление по теме) к нему не применяются.

Графы — примеры, а не публичный API пакета: `@antv/x6`, `@joint/core` и `@xyflow/react` стоят только в devDependencies, а сторис вызывает их напрямую, без обёрток. Библиотеки не читают CSS-переменные в SVG-атрибутах, поэтому пример берёт значения через `getComputedStyle` от своего контейнера и пересоздаёт граф при смене `data-theme`.

## Лицензии

|                  | Лицензия                                                         |
| ---------------- | ---------------------------------------------------------------- |
| Код              | MIT                                                              |
| Ant Design Icons | MIT                                                              |
| Manrope          | OFL                                                              |
| JetBrains Mono   | OFL                                                              |
| Linux Libertine  | GPL-2.0 с font exception, дополнительно OFL                      |
| ReactBits        | MIT + Commons Clause, вендорные копии использованных компонентов |
| X6, JointJS      | MIT, MPL-2.0 — devDependencies, только примеры                   |

Полные тексты лицензий шрифтов лежат в `LICENSES/`.
Сводка по шрифтам с правообладателями и источниками — в `THIRD-PARTY-NOTICES.md`.
