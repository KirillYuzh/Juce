# Motion

## Purpose

Единый стандарт движения: длительности и кривые берутся из токенов, декоративная анимация уважает системную настройку, а отклонение ловит `npm run lint:css`.

## Requirements

### Requirement: Движение берётся из токенов

The system SHALL express every transition duration through `--tb-duration-fast|base|slow` and every easing through `--tb-ease-standard`.

#### Scenario: Литерал вместо токена

- **WHEN** в CSS-модуле компонента встречается `transition: box-shadow 150ms var(--tb-ease-standard)`
- **THEN** `npm run lint:css` завершается ошибкой и подсказывает нужный токен

#### Scenario: Многострочное объявление

- **WHEN** значения `transition` перенесены на следующие строки
- **THEN** проверка читает объявление целиком и находит литерал

#### Scenario: Своя кривая

- **WHEN** вместо токена указан `cubic-bezier(...)`
- **THEN** проверка завершается ошибкой

### Requirement: Свойства перечисляются явно

The system SHALL forbid `transition: all`.

#### Scenario: Переход всех свойств

- **WHEN** компонент объявляет `transition: all var(--tb-duration-fast) var(--tb-ease-standard)`
- **THEN** `npm run lint:css` завершается ошибкой

### Requirement: Системная настройка отключает декоративное движение

The system SHALL collapse decorative animation and transitions to an imperceptible duration when `prefers-reduced-motion: reduce` is requested, while keeping progress indicators animated.

#### Scenario: Пользователь отключил движение

- **WHEN** система сообщает `prefers-reduced-motion: reduce`
- **THEN** переходы и декоративные анимации выполняются за `0.01ms`

#### Scenario: Индикатор загрузки

- **WHEN** тот же режим активен и компонент помечен классом `tb-motion-essential`
- **THEN** индикатор продолжает вращаться, потому что передаёт состояние, а не украшение

### Requirement: Защита движения объявлена в одном месте

The system SHALL declare the `prefers-reduced-motion` behavior only in `src/styles`, and SHALL fail when a component stylesheet declares its own reduced-motion block.

#### Scenario: Локальная копия защиты

- **WHEN** в CSS-модуле компонента появляется `@media (prefers-reduced-motion: reduce)`
- **THEN** `npm run lint:css` завершается ошибкой и указывает на `src/styles/motion.css`

### Requirement: Стандарт подключается вместе со стилями

The system SHALL load the motion guard from `src/styles/index.css`, so the library, the demo app and Storybook receive it with one styles import.

#### Scenario: Новый потребитель библиотеки

- **WHEN** приложение импортирует `juce-ui/styles.css`
- **THEN** глобальная защита движения применяется без дополнительного импорта

#### Scenario: Демо и Storybook

- **WHEN** открыты демо или Storybook
- **THEN** они подключают тот же `src/styles/index.css` и получают ту же защиту
