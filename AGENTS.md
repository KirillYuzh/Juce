# AGENTS.md

Проект: React UI-кит «Juce». Всё, что можно проверить автоматически, проверяется в `npm run check`.

## Слои

Импорты между слоями контролирует `boundaries/dependencies` из `eslint.config.js`.

| Слой                    | Может импортировать                       |
| ----------------------- | ----------------------------------------- |
| `src/lib`               | `lib`                                     |
| `src/data`              | `lib`, `data`                             |
| `src/components/ui`     | `lib`, `ui`                               |
| `src/components/ai`     | `lib`, `ui`, `ai`                         |
| `src/components/blocks` | `lib`, `data`, `ui`, `blocks`             |
| `src/sections`          | `lib`, `data`, `ui`, `blocks`, `sections` |
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

`radius="inset"` у компонента = радиус родителя минус его padding. Родитель задаёт `--tb-radius-parent` и `--tb-radius-parent-padding`, компонент — фолбэк `--tb-radius-fallback`. Хелпер — `radiusStyle` из `lib/radius`.

## Проверки

```bash
npm run check         # typecheck + eslint + ast-grep + фикстуры правил + тесты
npm run test:bombadil # property-based UI-тест чата в Storybook, нужен браузер
```

- Правила: `tools/rules/*.yml`, фикстуры — `tools/rules/fixtures/<id>/{bad,good}`.
- Тесты: `src/**/*.test.{ts,tsx}`, базовая линия — `tools/test-baseline.json`.
- Тестов стало меньше или появился `skip` — `npm run test` падает. Добавили тесты — `npm run test:update`, чтобы поднять базу.
- `test:bombadil` в `check` не входит: ему нужен живой Storybook и браузер. Подробности — в `docs/runtime.md`.

## Рантайм

Запуск, порты, драйвер Chrome и артефакты — в `docs/runtime.md`. Карта фич — `docs/features.md`.

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
