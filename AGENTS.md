# AGENTS.md

Проект: React UI-кит «Juce». Всё, что можно проверить автоматически, закрыто командами из раздела «Проверки».

## Слои

Импорты между слоями контролирует `boundaries/dependencies` из `eslint.config.js`.

| Слой                    | Может импортировать                       |
| ----------------------- | ----------------------------------------- |
| `src/lib`               | `lib`                                     |
| `src/data`              | `lib`, `data`                             |
| `src/components/ui`     | `lib`, `ui`                               |
| `src/components/ai`     | `lib`, `ui`, `ai`                         |
| `src/components/blocks` | `lib`, `data`, `ui`, `prebuilt`, `blocks` |
| `src/pages`             | все слои                                  |

`src/*.tsx`, `*.stories.tsx` и `*.test.*` не ограничены.

## Запрещено и чем заменять

| Нельзя                                                             | Можно                                                           |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| `const cx = (...)` в модуле                                        | `import { cx } from '<...>/lib/cx'`                             |
| `navigator.clipboard` напрямую                                     | `useCopy` из `components/ui/clipboard`                          |
| `any`                                                              | точный тип или `unknown` + проверка                             |
| `<T>value` вместо `value as T`                                     | `as T`                                                          |
| комментарии-оправдания (`workaround`, `hack`, `temporary`, `TODO`) | исправить причину или закрепить ограничение типом/тестом/README |
| `skip` / `only` в тестах                                           | починить причину или удалить тест вместе с кодом                |

## Радиусы

Проп `radius` типизирован: `'inset' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'pill'`. Число не принимается — только токен. Роли: `--tb-radius-control`, `--tb-radius-surface`, `--tb-radius-popover`, `--tb-radius-chip`, `--tb-radius-switch`, `--tb-radius-avatar`; шкала — `--tb-radius-xxs|xs|s|m|l|pill`.

`radius="inset"` = радиус родителя минус его padding, с клампом от нуля: `max(0px, calc(var(--tb-radius-parent, var(--tb-radius-fallback, var(--tb-radius-m))) - var(--tb-radius-parent-padding, 0px)))`. Родитель задаёт `--tb-radius-parent` и `--tb-radius-parent-padding`, компонент — фолбэк `--tb-radius-fallback`. Хелпер — `radiusStyle` из `lib/radius`.

## Темы

Цвет — `data-theme` (`light`, `dark`, `heroui`, `heroui-dark`, тёмные пресеты `ocean`, `dune`, `dusk`, `silk`, `aurora`). Компоненты не ветвятся по имени темы: только `--tb-*`-роли. Класс `.dark` удалён, второй оси для формы нет: радиусы, шрифты и движение — структурные роли в `src/styles/structure.css`. Контракт — `openspec/specs/theming/spec.md`.

Нейтрали (поверхности, текст, границы, серая шкала) объявлены один раз через `light-dark()`, без оттенка. Тема задаёт только акценты: `--tb-primary*`, `--tb-accent*`, ссылки. Правило 60-30-10 держит тест токенов.

## Поля

Видимая подпись поля — `placeholder`: в пустом поле он стоит по центру, при фокусе и заполнении уезжает наверх. Отдельный `label` — второй вариант: статичная подпись сверху, placeholder внутри не уезжает. `required` сам добавляет красную звёздочку, `requiredMark={false}` её убирает. Доступное имя берётся из `label`, затем `aria-label`, затем `placeholder`. Контракт — `openspec/specs/forms/spec.md`.

## Проверки

```bash
npm run check                  # typecheck + eslint + ast-grep + фикстуры + css + build:lib + check:pack + тесты + spec
npm run lint:css               # hover только под указателем, тема не в компонентах, размеры только токенами, transition только токенами и без all, без локальных prefers-reduced-motion
npm run check:pack             # проверка содержимого пакета
npm run spec:validate          # openspec validate --all --strict
npm run test:bombadil          # property-based UI-тест чата в Storybook, нужен браузер
```

- Правила: `tools/rules/*.yml`, фикстуры — `tools/rules/fixtures/<id>/{bad,good}`.
- Темы и структура: блоки токенов рукописные — цвет и темы в `src/styles/tokens.css`, тёмные пресеты в `src/styles/themes-presets.css`, радиусы/шрифты/движение в `src/styles/structure.css`, список тем — `src/styles/themes.ts`; генератора нет.
- Тесты: `src/**/*.test.{ts,tsx}`, базовая линия — `tools/test-baseline.json`.
- Типы публичного графа: `tsconfig.lib.json` включает `noUncheckedIndexedAccess`. Флаг живёт там, а не в `tsconfig.app.json`, потому что в проверку попадает только то, что уезжает в пакет (`src/index.ts`); вендорные копии в `src/patterns/**` под флаг не попадают. Проверяется в `npm run check` через `build:lib`.
- Тестов стало меньше или появился `skip` — `npm run test` падает. Добавили тесты — `npm run test:update`, чтобы поднять базу.
- `test:bombadil` в `check` не входит: ему нужен живой Storybook и браузер. Подробности — в `docs/runtime.md`.

## Рантайм

Запуск, порты, драйвер Chrome и артефакты — в `docs/runtime.md`. Карта фич — `docs/features.md`.

Сочетания примитивов — Storybook `Patterns` (`Layout`, `Using other libs`). Папки — `src/patterns/layout`, `src/patterns/using-other-libs/{react-bits,antv,jointjs}`. В `Patterns` только композиция импортированных компонентов: своих компонентов и обёрток над чужими библиотеками там нет. Карточка одна — `Card` (`components/ui/Card`); готовые композиции — `DetailCard` и `MediaPanel` в `components/prebuilt`; отдельных `*Card`-компонентов не заводим. Движение — токены `--tb-duration-*`, `--tb-ease-standard` и одна защита `prefers-reduced-motion` в `src/styles/motion.css`.

Фоны — вендорные `HoloMosaic`, `NeonGlyphs`, `GradientASCII`, `GhostFibers`, `Topography`, `SideRays`, `AeroShards`, компоненты — `TechText`, `ElectricLogo`, `SpecularButton`, `ProfileCard`, `PixelCard`, `SwipeRow`, `TargetCursor` в сторис `src/patterns/using-other-libs/react-bits`: библиотеки вызываются напрямую, без обёрток, а цвета темы передаются цветовыми пропсами, вычисленными через `getComputedStyle` (canvas не понимает `var()`) и приведёнными к hex — часть библиотек парсит их через `fillStyle` и молча игнорирует `oklch`; хук — `lib/use-theme-tokens.ts`; поверх фона и под контентом лежит скрим из `--tb-bg`, иначе текст нечитаем; без скрима показан только `SideRays`, где лучи уходят от текста. Фон можно ставить и на место медиа в карточках (`CardMedia`, `MediaPanel`, `DetailCard`, `mediaPosition="back"`). `AeroShards` рисует через WebGPU (`vgpu`, devDependency): без WebGPU `onError` убирает фон и сцену держит подложка. Новый фон или компонент добавляется так же — вендорный исходник в отдельной папке, прямой вызов в сторис. Компоненты react-bits применяются к нашим компонентам, а не заменяют их: `PixelCard` в `media` у `DetailCard`, `ProfileCard` поверх нашей карточки, `SwipeRow` с нашим контентом, `TargetCursor` над нашими кнопками, `ElectricLogo` с нашим логотипом. Вендорный CSS в папках библиотек (`backgrounds`, `Animations`, `Components`, `Micro`, `TextAnimations`) — исходники библиотек, поэтому правила кита про hover, токены движения и ветвление по теме к нему не применяются. Графы X6, JointJS и React Flow — примеры в `src/patterns/using-other-libs/{antv,jointjs,reactflow}`: библиотеки вызываются напрямую, без обёрток, а SVG-атрибуты не понимают `var()`, поэтому цвета, шрифты и радиусы читает `getComputedStyle` от контейнера, и граф пересоздаётся при смене `data-theme`. Литеральные цвета в атрибутах графа — та же ошибка, что в CSS.

Вкладка code в Storybook показывает только компоненты: `storySource` (`lib/story-source.ts`) срезает `render`, layout-обёртки и `style`. Сложный демо-компонент описывают через `docs.source.code`.

UI-правка без скриншота не готова: приложи PNG из `npm run drive -- screenshot artifacts/<фича>.png`.

## Правило правки

Поправили агента — сначала сделайте ошибку невозможной или автоматической:

1. тип или API, в котором нельзя ошибиться;
2. правило линтера (`tools/rules` или `eslint.config.js`);
3. тест;
4. runtime-проверка;
5. короткая строка прозы здесь — только если ничего выше не подошло.

Добавили проверку — сразу почистите все старые вхождения.
