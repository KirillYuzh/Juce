# Theming

## Purpose

Контракт темы: как кит получает цвет, какие роли обязаны объявлять темы, как проверяется контраст и как добавляется новая тема. Компонент запрашивает роль `--tb-*` и не знает имени темы.

Цвет и `color-scheme` задаёт `data-theme`. Значения: `light` (по умолчанию), `dark`, `heroui`, `heroui-dark` и тёмные пресеты `ocean`, `dune`, `dusk`, `silk`, `aurora`.

Нейтральные роли объявлены один раз на режим и не имеют оттенка; тема задаёт только акценты, поэтому работает правило 60-30-10.

Форма — одна на кит: радиусы, шрифты и движение объявлены структурными ролями в `src/styles/structure.css` и от темы не зависят.

## Requirements

### Requirement: Одна ось — тема

The system SHALL resolve colour from `data-theme` on any container element, SHALL reset it on a nested scope, and SHALL NOT support a second axis for shape.

Scope — контейнер, несущий `data-theme`.

#### Scenario: Тема по умолчанию

- **WHEN** на странице нет `data-theme`
- **THEN** действует `light` из `:root`, а `color-scheme` равен `light`

#### Scenario: Две темы на одной странице

- **WHEN** рядом стоят два контейнера с разными `data-theme`
- **THEN** каждый рисует свою тему, не меняя значения соседа

#### Scenario: Вложенность сбрасывает тему

- **WHEN** внутри контейнера `data-theme="dark"` появляется контейнер с `light`
- **THEN** внутри действуют светлые цвета, а не смесь внешней и внутренней темы

#### Scenario: Второй оси формы нет

- **WHEN** в разметке или CSS появляется `data-skin` либо класс `.dark`
- **THEN** это нарушение контракта: форма задаётся структурными ролями, а тема — только `data-theme`

### Requirement: Контракт ролей

The system SHALL declare the shared neutral set once per colour mode, SHALL declare only accent roles in theme scopes, and components SHALL use only `--tb-*` roles.

#### Scenario: Каждый scope объявляет структурный набор

- **WHEN** контейнер получает `data-theme`
- **THEN** он объявляет радиусы (`--tb-radius-control`, `--tb-radius-surface`, `--tb-radius-popover`, `--tb-radius-chip`, `--tb-radius-switch`, `--tb-radius-avatar`, шкалу `--tb-radius-xxs`, `--tb-radius-xs`, `--tb-radius-s`, `--tb-radius-m`, `--tb-radius-l`, `--tb-radius-pill`, `--tb-radius-circle`), `--tb-focus-ring`, плотность (`--tb-space-*`), типографику (`--tb-font-*`, `--tb-container`, `--tb-gutter`, `--tb-header-height`) и движение (`--tb-duration-*`, `--tb-ease-*`)

#### Scenario: Нейтральный набор общий

- **WHEN** тема не задаёт нейтральную роль
- **THEN** роль приходит из общего блока `:root, [data-theme]`, где светлое и тёмное значения объявлены одной функцией `light-dark()` и выбираются по `color-scheme` контейнера

#### Scenario: Тема объявляет акцентный набор

- **WHEN** тема объявляет цвет
- **THEN** она задаёт только акценты: `--tb-primary`, `--tb-primary-hover`, `--tb-primary-active`, `--tb-on-primary`, `--tb-accent`, `--tb-accent-hover`, `--tb-accent-soft`, `--tb-accent-text`, `--tb-accent-text-hover`, `--tb-accent-on-inverse`, `--tb-on-accent`, `--link`, `--link-hover` и `--tb-border-on-primary`, а тёмный пресет ещё и `--tb-rb-horizon`, `--tb-rb-wave`, `--tb-rb-crest`

#### Scenario: Компонент берёт роль

- **WHEN** компоненту нужен цвет, радиус или тень
- **THEN** он использует `--tb-*`-роль и не упоминает палитровые переменные (`--ink`, `--coral`) и литеральные цвета

#### Scenario: Нейтральная роль с оттенком

- **WHEN** тест токенов проверяет нейтральные роли
- **THEN** поверхности, текст, границы и серая шкала имеют chroma 0, иначе тест падает с именем роли и темы

#### Scenario: Тема переопределяет нейтраль

- **WHEN** в блоке `[data-theme=…]` появляется нейтральная роль
- **THEN** тест токенов падает: тема меняет только акценты, иначе расползается правило 60-30-10

#### Scenario: Литеральный цвет или палитровая переменная в компоненте

- **WHEN** в CSS компонента появляется `#hex`, `rgb()`, `oklch()` или палитровая переменная (`var(--ink)`, `var(--coral)`)
- **THEN** `npm run lint:css` падает на компоненте и требует `--tb-*`-роль

### Requirement: Роли фонов

The system SHALL declare `--tb-rb-horizon`, `--tb-rb-wave` and `--tb-rb-crest` in every scope with values derived from the theme, and decorative backgrounds SHALL use only these roles.

#### Scenario: Фон в любой теме

- **WHEN** фоновый слой рендерится без `data-theme` или в теме без пресета
- **THEN** роли `--tb-rb-*` разрешаются в базовые роли темы, и слой остаётся видимым

#### Scenario: Тема перекрашивает фон

- **WHEN** у контейнера меняется `data-theme` на пресет
- **THEN** фоновый слой меняет цвет без правок компонента, потому что читает только роли

### Requirement: Scope красит поверхность

The system SHALL paint the scope surface with `background-color` and `color-scheme` from the theme, and floating layers MUST stay inside a scope or receive the theme attribute explicitly.

#### Scenario: Плавающий слой внутри scope

- **WHEN** поповер, меню или тултип открывается из элемента внутри scope
- **THEN** слой отрисован в той же теме: портал остаётся внутри контейнера scope либо получает `data-theme` владельца явно

#### Scenario: Слой вне scope

- **WHEN** слой рендерится в `document.body` вне контейнера scope
- **THEN** он получает атрибут темы от владельца, а не наследует значения соседнего scope

### Requirement: Контраст пар

The system SHALL verify WCAG AA contrast for every theme on its text, border and on-colour pairs, and SHALL fail when any pair drops below its threshold. APCA is a recommendation and never a gate.

#### Scenario: Текст и ссылки

- **WHEN** тест проверяет тему
- **THEN** `--tb-text-primary`, `--tb-text-secondary`, `--tb-text-muted` и `--tb-text-link` держат не меньше 4.5 на `--tb-bg`, `--tb-surface` и `--tb-bg-secondary`, а декоративный `--tb-text-tertiary` — не меньше 3 на тех же поверхностях

#### Scenario: Границы и пары на заливке

- **WHEN** тест проверяет тему
- **THEN** `--tb-border-control` держит не меньше 3 на `--tb-bg`, `--tb-surface` и `--tb-field`, а `--tb-on-primary` на `--tb-primary` и `--tb-on-accent` на `--tb-accent` — не меньше 4.5

#### Scenario: Пара ниже порога

- **WHEN** любая пара не дотягивает до порога
- **THEN** тест токенов падает и называет тему, пару и фактическое отношение

### Requirement: Один способ добавить тему

The system SHALL add a theme as a single hand-written token block in `src/styles` that the token test picks up, SHALL NOT generate palettes, and SHALL NOT branch on a theme name in components.

Темы — рукописные блоки в `src/styles/tokens.css` и `src/styles/themes-presets.css`, список значений — в `src/styles/themes.ts`; генератора нет.

#### Scenario: Список тем совпадает с блоками CSS

- **WHEN** тема добавлена, переименована или удалена
- **THEN** набор значений в `themes.ts` и набор блоков `[data-theme=…]` совпадают, иначе тест токенов падает

#### Scenario: Новая тема

- **WHEN** добавляется тема
- **THEN** появляется один блок `[data-theme='…']` с `color-scheme` и акцентным набором, тест токенов подхватывает его сам, а компоненты не меняются

#### Scenario: Неполный акцентный набор

- **WHEN** в блоке темы пропущена акцентная роль
- **THEN** тест токенов падает с именем пропущенного токена: акцент не наследуется от соседней темы

#### Scenario: Ветвление по имени темы

- **WHEN** в CSS-модуле компонента появляется селектор `[data-theme=…]` или `[data-skin=…]`
- **THEN** `npm run lint:css` падает: выбор уже сделан токенами

#### Scenario: Тёмная тема

- **WHEN** нужно включить тёмную тему
- **THEN** ставится `data-theme="dark"`; класс `.dark` удалён и не поддерживается

### Requirement: Радиусы только токенами

The system SHALL accept radius only through the typed `radius` prop and named tokens, and SHALL clamp `inset` at zero.

#### Scenario: Число в пропе

- **WHEN** в `radius` передают число
- **THEN** typecheck падает: тип — `'inset' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'pill'`

#### Scenario: Inset меньше нуля

- **WHEN** padding родителя больше его радиуса
- **THEN** `inset` даёт `0`, а не отрицательное значение (`max(0px, calc(…))`)

#### Scenario: Нестандартный радиус

- **WHEN** нужен радиус, которого нет в шкале
- **THEN** добавляют роль в структурный набор `structure.css`, а не число в компонент
