# Theming

## Purpose

Контракт темы: как кит получает цвет и форму, какие роли обязаны объявлять темы и скины, как проверяется контраст и как добавляется новая тема. Компонент запрашивает роль `--tb-*` и не знает имени темы.

Оси независимы:

- `data-theme` — цвет и `color-scheme`. Значения: `light` (по умолчанию), `dark`, `palette-wasabi`, `palette-wasabi-dark`.
- `data-skin` — форма: радиусы, фон поверхности и снятие теней. Значения: `default` (по умолчанию), `blueprint`.

## Requirements

### Requirement: Две независимые оси

The system SHALL resolve colour from `data-theme` and shape from `data-skin`, independently, on any container element, and SHALL reset both axes on a nested scope.

Scope — контейнер, несущий атрибуты темы. Вложенный scope не смешивает уровни: цвет не может прийти из внешнего контейнера, а форма — из внутреннего, и наоборот.

#### Scenario: Тема по умолчанию

- **WHEN** на странице нет `data-theme` и `data-skin`
- **THEN** действуют `light` и `default` из `:root`, а `color-scheme` равен `light`

#### Scenario: Цвет и форма задаются раздельно

- **WHEN** контейнер получает `data-theme="palette-wasabi-dark"` и `data-skin="blueprint"`
- **THEN** цветовые роли и `color-scheme: dark` приходят из темы, радиусы и фон-сетка — из скина, а тени скин может снять

#### Scenario: Две темы на одной странице

- **WHEN** рядом стоят два контейнера с разными `data-theme` и `data-skin`
- **THEN** каждый рисует свою пару, не меняя значения соседа

#### Scenario: Вложенность сбрасывает обе оси

- **WHEN** внутри контейнера `data-theme="dark" data-skin="blueprint"` появляется контейнер с `light` и `default`
- **THEN** внутри действуют светлые цвета и форма `default`, а не смесь внешней и внутренней оси

#### Scenario: Скин есть у каждой темы

- **WHEN** выбран `data-skin="blueprint"`
- **THEN** он определён независимо от темы, и обе комбинации — светлая и тёмная — проходят проверки

### Requirement: Контракт ролей

The system SHALL declare the complete structural set in every scope and the complete colour set in every theme scope, and components SHALL use only `--tb-*` roles.

#### Scenario: Каждый scope объявляет структурный набор

- **WHEN** scope получает `data-theme` или `data-skin`
- **THEN** он объявляет радиусы (`--tb-radius-control`, `--tb-radius-surface`, `--tb-radius-popover`, `--tb-radius-chip`, `--tb-radius-switch`, `--tb-radius-avatar`, шкалу `--tb-radius-xxs`, `--tb-radius-xs`, `--tb-radius-s`, `--tb-radius-m`, `--tb-radius-l`, `--tb-radius-pill`, `--tb-radius-circle`), `--tb-focus-ring`, `--tb-surface-pattern` с `--tb-surface-pattern-size`, плотность (`--tb-space-*`) и типографику (`--tb-font-*`, `--tb-container`, `--tb-gutter`, `--tb-header-height`)

#### Scenario: Тема объявляет цветовой набор

- **WHEN** тема объявляет цвет
- **THEN** она задаёт поверхности (`--tb-bg`, `--tb-surface`, `--tb-bg-secondary`, `--tb-bg-tertiary`, `--tb-bg-hover`, `--tb-field`, `--tb-field-hover`, `--tb-option-hover`, `--tb-option-selected`), текст (`--tb-text-primary`, `--tb-text-secondary`, `--tb-text-muted`, `--tb-text-tertiary`, `--tb-text-link`, `--tb-text-link-hover`, `--tb-text-inverse`, `--tb-text-inverse-secondary`, `--tb-text-inverse-tertiary`, `--tb-text-inverse-link`), действия (`--tb-primary`, `--tb-primary-hover`, `--tb-primary-active`, `--tb-on-primary`, `--tb-secondary`, `--tb-secondary-hover`, `--tb-secondary-soft`, `--tb-accent`, `--tb-accent-hover`, `--tb-accent-soft`, `--tb-accent-text`, `--tb-accent-text-hover`, `--tb-accent-on-inverse`, `--tb-on-accent`), статусы (`--tb-success`, `--tb-success-text`, `--tb-success-soft`, `--tb-error`, `--tb-error-text`, `--tb-error-soft`, `--tb-warning`, `--tb-warning-text`), границы и оверлей (`--tb-border`, `--tb-border-strong`, `--tb-border-control`, `--tb-border-inverse`, `--tb-border-on-primary`, `--tb-overlay`), данные (`--tb-chart-1`…`--tb-chart-4`, `--tb-skeleton`, `--tb-skeleton-highlight`, `--tb-syntax-property`) и тени (`--tb-shadow-control`, `--tb-shadow-card`, `--tb-shadow-popover`, `--tb-shadow-modal`, `--tb-shadow-float`)

#### Scenario: Скин меняет форму, тема — цвет

- **WHEN** скин переопределяет структурные роли (например, `blueprint` берёт нулевые радиусы, снятые тени и моноширинный шрифт заголовков)
- **THEN** тема структурные роли не трогает, а компоненты получают изменение без правок

#### Scenario: Компонент берёт роль

- **WHEN** компоненту нужен цвет, радиус или тень
- **THEN** он использует `--tb-*`-роль и не упоминает палитровые переменные (`--ink`, `--coral`) и литеральные цвета

#### Scenario: Scope объявляет набор целиком

- **WHEN** в `tokens.css`, `skins.css` или `themes.css` появляется блок `[data-theme=…]` или `[data-skin=…]`
- **THEN** цветовой блок объявляет все роли своей темы, иначе тест токенов падает с именем пропущенного токена

#### Scenario: Литеральный цвет или палитровая переменная в компоненте

- **WHEN** в CSS компонента появляется `#hex`, `rgb()`, `oklch()` или палитровая переменная (`var(--ink)`, `var(--coral)`)
- **THEN** `npm run lint:css` падает на компоненте и требует `--tb-*`-роль

### Requirement: Scope красит поверхность

The system SHALL paint the scope surface with `background-color` from the theme, `background-image` and `background-size` from the skin pattern, and `color-scheme` from the theme, and floating layers MUST stay inside a scope or receive the theme attributes explicitly.

#### Scenario: Скин рисует поверхность

- **WHEN** scope получает `data-skin="blueprint"`
- **THEN** он рисует фон-сетку скина и свои радиусы, а не фон и формы родителя

#### Scenario: Плавающий слой внутри scope

- **WHEN** поповер, меню или тултип открывается из элемента внутри scope
- **THEN** слой отрисован в той же теме и скине: портал остаётся внутри контейнера scope либо получает `data-theme` и `data-skin` владельца явно

#### Scenario: Слой вне scope

- **WHEN** слой рендерится в `document.body` вне контейнера scope
- **THEN** он получает атрибуты темы от владельца, а не наследует значения соседнего scope

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

The system SHALL add a theme or a skin as a single token block that the token test picks up, SHALL generate palettes through `scripts/gen-themes.mjs`, SHALL NOT branch on a theme or skin name in components, and SHALL NOT support the `.dark` class.

Палитры `palette-wasabi` и `palette-wasabi-dark` собираются генератором в `src/styles/themes.css` и `src/styles/themes.ts`; `npm run gen:themes -- --check` падает при расхождении файлов с генератором.

#### Scenario: Новая тема

- **WHEN** добавляется тема
- **THEN** появляется один блок `[data-theme='…']` с полным цветовым набором, тест токенов подхватывает его сам, а компоненты не меняются

#### Scenario: Новая палитра

- **WHEN** в список палитр генератора добавляется `palette-…`
- **THEN** `npm run gen:themes` пересобирает `themes.css` и `themes.ts`, а `npm run gen:themes -- --check` проходит

#### Scenario: Правка сгенерированного файла

- **WHEN** `themes.css` или `themes.ts` правят руками
- **THEN** `npm run gen:themes -- --check` падает, а `npm run gen:themes` перезаписывает файлы

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
- **THEN** добавляют роль в структурный набор скина, а не число в компонент
