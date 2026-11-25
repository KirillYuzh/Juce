# Components

## Purpose

Контракт библиотеки компонентов: сколько компонентов одного назначения допустимо, как собираются новые, как примеры попадают в Storybook и откуда берутся стили, темы, движение и доступность.

Библиотека растёт не числом компонентов, а числом надёжных примитивов: одна карточка вместо набора похожих, один способ собрать компонент, одна история на компонент. Повторяющийся вид живёт в базовом компоненте или токене, а не в копии CSS-модуля. Опора — открытый код shadcn/ui (карточка как набор составных частей со слотом `data-slot`, вариативность через `variant`/`size`, примитивы доступности без обёрток) и react-bits (компонент как самостоятельный исходник, настройка пропсами и CSS-переменными, сторонний пример без адаптера). Оба проекта подтверждают три правила: вариативность — пропсами, композиция — слотами, примеры — прямым вызовом библиотеки.

Границы поведения задают существующие контракты: цвет и темы — `theming`, поля — `forms`, движение — `motion`. Этот документ не переписывает их, а фиксирует, что компонент им подчиняется.

## Requirements

### Requirement: Один компонент карточки

The system SHALL provide exactly one card component assembled from a small set of parts and props, SHALL cover promo, text-only and media-with-footer layouts, and SHALL NOT expose sibling card components such as `ProductCard`, `PromoCard`, `TextCard`, `StatPanel`, `WideBanner` or `DirectionCard`.

#### Scenario: Промо-карточка

- **WHEN** карточке нужны изображение, заголовок, текст и действие
- **THEN** всё это собирается из одного Card и его составных частей, а не из отдельного `PromoCard`

#### Scenario: Текстовая карточка

- **WHEN** карточке не нужно изображение
- **THEN** используется тот же Card без медиа-части, а отдельного `TextCard` нет

#### Scenario: Изображение сверху и footer

- **WHEN** карточке нужны изображение сверху и нижняя полоса
- **THEN** нижняя часть Card живёт на том же фоне, что и карточка, и содержит заголовок с подзаголовком

#### Scenario: Новая вариация

- **WHEN** продукту нужен вид карточки, которого нет среди трёх видов
- **THEN** вид выражается пропсом или составной частью Card, а новый компонент карточки не заводится

#### Scenario: Похожий компонент в публичном API

- **WHEN** в публичном API появляется `ProductCard`, `PromoCard`, `TextCard`, `StatPanel`, `WideBanner`, `DirectionCard` или другой компонент-карточка
- **THEN** это нарушение контракта: это вариация Card

### Requirement: Раскладка принадлежит сетке, а не карточке

The system SHALL keep columns, spans and order in the layout primitives, and SHALL NOT add grid props to the card.

#### Scenario: Карточка шире соседней

- **WHEN** одна карточка занимает две колонки в сетке
- **THEN** это задаёт сетка, а Card не получает пропс `span`/`columns`

#### Scenario: Список карточек

- **WHEN** секция показывает массив карточек из данных
- **THEN** секция раскладывает их сеткой и передаёт данные в Card, а не заводит компонент на каждый элемент

### Requirement: Два смысла раздела Patterns

The system SHALL expose exactly two Pattern sections: `Patterns/Layout` for ready screen compositions from kit components, and `Patterns/Using other libs` for direct third-party usage.

#### Scenario: Готовая компоновка

- **WHEN** пример собирает страницу, дашборд или чат-лейаут из наших компонентов
- **THEN** он лежит в `Patterns/Layout`

#### Scenario: Сторонняя библиотека напрямую

- **WHEN** пример показывает стороннюю библиотеку
- **THEN** он импортирует её напрямую и передаёт наши значения, например `color="var(--tb-primary)"`

#### Scenario: Подгонка под кит

- **WHEN** стороннему компоненту нужны наши отступы, радиусы или соседство с нашими компонентами
- **THEN** пример задаёт их пропсами и значениями `--tb-*` на месте, без обёртки и без литералов

#### Scenario: Обёртка над сторонней библиотекой

- **WHEN** для чужой библиотеки появляется компонент-обёртка или адаптер
- **THEN** это нарушение контракта: пример настраивает библиотеку пропсами и ролями на месте

#### Scenario: Третий раздел

- **WHEN** в `Patterns` появляется раздел, который не компоновка и не совместное использование
- **THEN** это нарушение контракта: у `Patterns` два смысла, а отдельный показ одного компонента живёт в его истории

### Requirement: Готовые композиции в разделе Prebuilt

The system SHALL expose ready-to-use compositions from the public API in a separate `Prebuilt` Storybook section, and SHALL keep `Patterns` for compositions built in place from primitives.

#### Scenario: Готовая карточка

- **WHEN** пользователю нужен `Detail card` или `Media panel`
- **THEN** он находит их в разделе `Prebuilt`, а не в `Primitives` и не в `Patterns`

#### Scenario: Пример вместо готового API

- **WHEN** в `Patterns` показывают готовый компонент из `components/prebuilt`
- **THEN** это нарушение контракта: `Prebuilt` — готовое API, `Patterns` — композиция на месте

### Requirement: Единственный способ создать компонент

New components SHALL be assembled only from existing primitives and `--tb-*` tokens. The system SHALL NOT add a parallel implementation of an existing primitive, a second wrapper over a primitive or third-party library, or a second styling system.

#### Scenario: Похожий элемент

- **WHEN** нужен элемент, близкий к существующему компоненту
- **THEN** существующий компонент расширяют новым пропсом или составной частью, а не пишут рядом второй

#### Scenario: Второй Button

- **WHEN** появляется второй `Button`, вторая карточка или своя обёртка над чужой библиотекой
- **THEN** это нарушение контракта: один вид — один компонент

#### Scenario: Стили с нуля

- **WHEN** новому компоненту нужны цвет, радиус или движение
- **THEN** он берёт роли `--tb-*` и структурные токены, а не литералы и не собственную шкалу

#### Scenario: Новый примитив

- **WHEN** нужного примитива действительно нет
- **THEN** он добавляется в `components/ui` как единственный экземпляр своего назначения, после чего остальные слои собираются из него

### Requirement: Одна история на компонент

The system SHALL show every component in Storybook exactly once, with one story per component, and SHALL remove variants and stories the product does not use.

#### Scenario: Открыть компонент

- **WHEN** пользователь открывает компонент в Storybook
- **THEN** он видит одну историю этого компонента, а не набор вариантов ради вариантов

#### Scenario: Вариант нужен продукту

- **WHEN** у компонента есть вариант, который используется в продукте
- **THEN** он показан аргументами или частями внутри той же истории

#### Scenario: Вариант не используется

- **WHEN** вариант, пропс или история не встречаются в продукте
- **THEN** они удаляются вместе с поддержкой, а не остаются на всякий случай

#### Scenario: Вторая история

- **WHEN** на один публичный компонент добавляют вторую историю
- **THEN** это нарушение контракта: отдельная история допустима только для другого публичного компонента или для примера в `Patterns`

### Requirement: Наследование вместо дублирования стилей

The system SHALL keep shared styles and behaviour in base components, SHALL let smaller components inherit them, and SHALL NOT duplicate the same surface, typography or radius rules in a new `*.module.css`.

#### Scenario: Общий вид

- **WHEN** два компонента используют одинаковую поверхность, типографику или радиус
- **THEN** правило живёт в базовом компоненте или токене, а не копируется во второй модуль

#### Scenario: Новый модуль стилей

- **WHEN** новый `*.module.css` повторяет правила существующего компонента
- **THEN** это нарушение контракта: компонент наследует базу или берёт токен

#### Scenario: Мелкий компонент

- **WHEN** маленький компонент нужен для одной роли
- **THEN** он компонует базовый компонент и не заводит собственный слой стилей без нового поведения

#### Scenario: Общая роль

- **WHEN** одна и та же роль, например footer с фоном, нужна в двух местах
- **THEN** она объявлена один раз в базе и переиспользуется

### Requirement: Доступность и темы по существующим контрактам

Components SHALL follow the existing `theming`, `forms` and `motion` contracts: colours only through `--tb-*` roles, theme only through `data-theme`, radius and motion only through tokens, and accessible name plus keyboard behaviour non-optional.

#### Scenario: Смена темы

- **WHEN** у контейнера меняется `data-theme`
- **THEN** компонент перекрашивается через роли `--tb-*` без ветвления по имени темы

#### Scenario: Интерактивный компонент

- **WHEN** компонент интерактивен
- **THEN** у него есть семантическая роль, доступное имя и работа с клавиатуры и фокуса, а пример в Storybook это не отменяет

#### Scenario: Движение

- **WHEN** компонент анимируется
- **THEN** длительности и кривые берутся из `--tb-duration-*` и `--tb-ease-*`, а `prefers-reduced-motion` обрабатывается единственной защитой в `src/styles`

#### Scenario: Поле ввода

- **WHEN** компонент содержит поле ввода
- **THEN** подпись, `required` и доступное имя работают по контракту `forms`

#### Scenario: Литеральный цвет

- **WHEN** в компоненте появляется литеральный цвет или палитровая переменная
- **THEN** `npm run lint:css` падает по контракту `theming`
