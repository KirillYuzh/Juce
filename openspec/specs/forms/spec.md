# Forms

## Purpose

Правила полей ввода: что служит видимой подписью, как помечается обязательность и как не потерять доступное имя.

## Requirements

### Requirement: Placeholder служит видимой подписью

The system SHALL use the placeholder as the visible field label by default, without rendering a second label above the control.

#### Scenario: Поле без label

- **WHEN** `Input` или `Textarea` получает `placeholder` и не получает `label`
- **THEN** над полем нет отдельной подписи, а placeholder показывает назначение поля

#### Scenario: Явная подпись

- **WHEN** передан `label`
- **THEN** подпись остаётся видимой и связывается с полем через `htmlFor`, а placeholder не дублирует её смысл

### Requirement: Обязательное поле помечается автоматически

The system SHALL render a red asterisk for a required field without extra markup in the consumer, and SHALL allow suppressing it with `requiredMark={false}`.

#### Scenario: Флаг required

- **WHEN** поле получает `required`
- **THEN** рядом с подписью или placeholder появляется красная звёздочка

#### Scenario: Скрытая звёздочка

- **WHEN** у обязательного поля стоит `requiredMark={false}`
- **THEN** звёздочки нет, но поле остаётся обязательным

### Requirement: Доступное имя не теряется

The system SHALL expose an accessible name from `label`, then `aria-label`, then `placeholder`.

#### Scenario: Только placeholder

- **WHEN** у поля нет `label` и `aria-label`
- **THEN** `placeholder` становится доступным именем поля

#### Scenario: Явный aria-label

- **WHEN** передан `aria-label`
- **THEN** он остаётся доступным именем, даже если placeholder короче или содержит подсказку
