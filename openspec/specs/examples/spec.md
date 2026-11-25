# Examples

## Purpose

Контракт раздела `Patterns` в Storybook: примеры собирают примитивы и не заводят нового API; фоновый слой и графы берут цвет и шрифт из ролей темы и переживают смену `data-theme` на любой части страницы. У раздела два смысла: `Layout` — готовые шаблоны компоновки, `Using other libs` — прямое совместное использование со сторонними библиотеками.

## Requirements

### Requirement: Разделы примеров

The system SHALL expose examples as exactly two Storybook sections — `Layout` and `Using other libs` — and each section SHALL demonstrate composition without introducing a second way to do the same thing. Показ отдельного компонента карточки живёт в его собственной истории, а не в `Patterns`.

#### Scenario: Поиск примера

- **WHEN** пользователь открывает раздел `Patterns`
- **THEN** он видит ровно два раздела: `Layout` (готовые компоновки экранов) и `Using other libs` (`react-bits`, `antv`, `jointjs`), и каждый пример отвечает на один вопрос «как собрать экран или как совместить библиотеку с китом»

#### Scenario: Пример не дублирует примитив

- **WHEN** примеру нужен существующий контрол
- **THEN** он берёт примитив из `components/ui`, а не рисует собственную разметку того же вида

### Requirement: Фоновый слой

The system SHALL render the decorative backdrop as an absolutely positioned layer that inherits the parent radius, stays behind content with a negative stack level, hides from assistive technology, and paints only with `--tb-rb-*` roles.

#### Scenario: Фон под содержимым

- **WHEN** фоновый слой стоит первым ребёнком карточки с созданным контекстом наложения
- **THEN** он виден над фоном карточки и не перекрывает текст и контролы

#### Scenario: Смена темы

- **WHEN** у контейнера меняется `data-theme`
- **THEN** фон перекрашивается вместе с родителем, без правок компонента

#### Scenario: Скрытый от скринридера

- **WHEN** фоновый слой отрисован
- **THEN** он помечен как декоративный и не появляется в дереве доступности

### Requirement: Движение фона

The system SHALL drive decorative motion from `--tb-duration-ambient*` and `--tb-ease-standard`, and SHALL leave the single `prefers-reduced-motion` guard in `src/styles/motion.css`.

#### Scenario: Уменьшенное движение

- **WHEN** в системе включён `prefers-reduced-motion: reduce`
- **THEN** фон замирает без локального медиазапроса в компоненте

#### Scenario: Литеральное время

- **WHEN** в CSS фона появляется время или кривая литералом
- **THEN** `npm run lint:css` падает и требует токен

### Requirement: Графы на токенах темы

The system SHALL use the X6 and JointJS APIs directly in stories without a wrapper component, SHALL colour nodes, edges and labels from theme roles read from the rendered container, and SHALL rebuild the graph when `data-theme` changes.

#### Scenario: Граф в тёмной теме

- **WHEN** контейнер получает `data-theme="dark"` или тёмный пресет
- **THEN** заливка узлов, границы, текст и линии читаются на поверхности и отличаются от неё

#### Scenario: Две темы на одной странице

- **WHEN** два графа стоят в разных контейнерах с разными `data-theme`
- **THEN** каждый граф читает токены своего контейнера и не перекрашивает соседа

#### Scenario: Литеральный цвет в графе

- **WHEN** в атрибуты узла или ребра попадает литеральный цвет
- **THEN** это нарушение контракта: цвет берётся из роли темы, как в CSS

#### Scenario: Обёртка над библиотекой

- **WHEN** для графа появляется собственный компонент кита с своим API
- **THEN** это нарушение контракта: пример вызывает X6 или JointJS напрямую, а кит отвечает только за токены и примитивы вокруг
