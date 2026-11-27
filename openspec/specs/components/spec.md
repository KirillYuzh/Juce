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

#### Scenario: Поверхность поля

- **WHEN** отрисовано поле ввода, выбора или отметки
- **THEN** его фон — `--tb-surface`, граница — `--tb-border` или `--tb-border-control`, hover — `--tb-bg-secondary`, а фокус — кольцо `--tb-primary`, как у карточки

#### Scenario: Литеральный цвет

- **WHEN** в компоненте появляется литеральный цвет или палитровая переменная
- **THEN** `npm run lint:css` падает по контракту `theming`

### Requirement: Один примитив изображения

The system SHALL provide exactly one image primitive `Image` with `fallback` and `placeholder` as `ReactNode`, and SHALL NOT add a sibling image component or a second media wrapper.

#### Scenario: Пустой `src`

- **WHEN** в `Image` не передан `src`
- **THEN** показывается `fallback`, а состояние равно `error`

#### Scenario: Ошибка загрузки

- **WHEN** браузер не смог загрузить изображение
- **THEN** показывается `fallback`, а не сломанная картинка

#### Scenario: Загрузка

- **WHEN** изображение ещё грузится и передан `placeholder`
- **THEN** поверх места показывается `placeholder` до `onLoad`

#### Scenario: Изображение в карточке

- **WHEN** `Image` стоит на месте медиа в `CardMedia`
- **THEN** `fallback` рисуется внутри области медиа, а API самой Card не меняется

### Requirement: Типографика для A2UI

The system SHALL express text through `Text`, `Heading`, `Quote`, `Callout`, `OrderedList`, `UnorderedList`, `ListItem` и `InlineCode`, and their sizes and tones SHALL come from the same tokens as Markdown.

#### Scenario: Тона Callout

- **WHEN** у `Callout` задан `tone`
- **THEN** допустимы только `note`, `important`, `warning`, `error` и `success`, а иконка и цвет берутся из роли тона

#### Scenario: Уровень заголовка

- **WHEN** у `Heading` задан `level`
- **THEN** разметка — соответствующий `h1`–`h6`, а размер приходит из токенов, а не из числа в стиле

#### Scenario: Списки и код

- **WHEN** A2UI нужен список или код в строке
- **THEN** используются `OrderedList`/`UnorderedList` с `ListItem` и `InlineCode`, а не собственная разметка

#### Scenario: Ссылка в тексте

- **WHEN** у `Text` задан `href`
- **THEN** рендерится настоящий `a` через общий `LinkRenderer` с обработкой безопасного `href`, а не `span` с обработчиком клика

#### Scenario: Подчёркивание ссылки

- **WHEN** у `Text` с `href` задан `variant="hover"`
- **THEN** по умолчанию ссылка без подчёркивания, а линия появляется только при наведении

#### Scenario: Действие в Callout

- **WHEN** у `Callout` задан `action`
- **THEN** это `{ label, onClick }`, компонент сам рендерит `Button` с `variant="outline"` и `size="s"` справа снизу в одной строке с текстом, как в тосте

#### Scenario: Второй текстовый примитив

- **WHEN** появляется ещё один компонент абзаца, заголовка или списка вместо расширения существующего
- **THEN** это нарушение контракта: один вид — один компонент

### Requirement: Раскладка живёт в Stack и Grid

The system SHALL own layout only in `Stack` and `Grid`, SHALL accept `gap` only as `--tb-space-*` tokens, and SHALL NOT add a `CardGrid` or grid props to `Card`.

#### Scenario: Отступ

- **WHEN** `Stack` или `Grid` получает `gap`
- **THEN** значение — токен `--tb-space-*`, а не число и не литерал

#### Scenario: Сетка карточек

- **WHEN** секции нужна сетка карточек
- **THEN** используется `Grid`, а отдельный `CardGrid` не заводится

#### Scenario: Колонки карточки

- **WHEN** карточке нужен другой размер в сетке
- **THEN** это задаёт `Grid`, а `Card` не получает пропс `columns`/`span`

### Requirement: Разделы страницы

The system SHALL switch page sections through `Tabs`, with `segmented` for local switches and `underline` for page-level navigation, and SHALL NOT add a second tab bar.

#### Scenario: Подчёркнутые табы

- **WHEN** разделы идут под заголовком страницы
- **THEN** используется `Tabs variant="underline"` с линией по всей ширине и активным подчёркиванием, а не своя навигация

#### Scenario: Счётчики в табах

- **WHEN** у раздела есть число
- **THEN** `label` получает узел с `Badge`, а новый пропс для счётчика не заводится

### Requirement: Одна таблица

The system SHALL provide exactly one `Table` with typed columns, SHALL forbid sorting and filtering of `kind: 'node'` columns at the type level, and SHALL keep sort, filters and selection controlled by props.

#### Scenario: Колонка значения

- **WHEN** колонка объявлена как `kind: 'value'`
- **THEN** она может быть `sortable` и `filterable`, а значение берётся из `value(row, index)`

#### Scenario: Колонка узла

- **WHEN** колонка объявлена как `kind: 'node'`
- **THEN** typecheck не даёт передать `sortable`, `filterable` или `value`: по узлу сортировать и фильтровать нельзя

#### Scenario: Управляемое состояние

- **WHEN** заданы `sort`, `filters` или `selectedKeys`
- **THEN** таблица показывает переданное состояние и сообщает изменения через `onSortChange`, `onFiltersChange` и `onSelectionChange`, а сама его не хранит

#### Scenario: Семантика

- **WHEN** таблица отрисована
- **THEN** это семантический `table` с `caption`, заголовочными ячейками и доступным именем, а не набор `div`

### Requirement: Markdown или A2UI, но не оба

The system SHALL render a chat message either from Markdown `content` or from the `extra` A2UI node, and SHALL NOT keep the `status` prop.

#### Scenario: Текстовый ответ

- **WHEN** у сообщения есть `content`
- **THEN** он рендерится через `Markdown`, включая стриминг

#### Scenario: A2UI-ответ

- **WHEN** у сообщения передан `extra`
- **THEN** рендерится `extra`, Markdown заменяет один из двух источников, а не смешивает оба

#### Scenario: Пустой чат

- **WHEN** сообщений нет
- **THEN** показывается `emptyState`, если он передан, иначе встроенная заглушка с `emptyTitle` и `emptyText`

#### Scenario: Свои действия

- **WHEN** передан `messageActions`
- **THEN** он заменяет встроенный набор действий над ответом, а не дополняет его

#### Scenario: Смешанные подсказки

- **WHEN** в `suggestions` передан массив строк и узлов
- **THEN** оба вида рендерятся одинаково и не требуют отдельного пропса

#### Scenario: Пропс `status`

- **WHEN** в `Chat` или `ChatMessage` появляется `status`
- **THEN** это нарушение контракта: стриминг выражается `streaming`, а статус ввода живёт в `PromptInput`

### Requirement: Один контракт ссылок

The system SHALL render every Markdown, Sources and InlineCitation link through one `LinkRenderer` contract, and `onLinkClick` SHALL receive every link.

#### Scenario: Своя ссылка

- **WHEN** в `Markdown`, `Sources` или `InlineCitation` передан `linkComponent`
- **THEN** любая ссылка рендерится этим компонентом с `href` и `onClick`

#### Scenario: Перехват клика

- **WHEN** передан `onLinkClick`
- **THEN** он вызывается для всех ссылок и получает `href` и событие

#### Scenario: Внутренняя и внешняя цель

- **WHEN** задан `linkTarget`
- **THEN** правило цели одинаково для всех ссылок: внутренние не открывают новую вкладку, внешние открываются в новой с доступным пояснением

#### Scenario: Поля источника

- **WHEN** источник описывается в `Sources` или `InlineCitation`
- **THEN** он использует общие поля `url`, `title`, `description`, `icon`, `href` и `onOpen`

#### Scenario: Второй рендер ссылки

- **WHEN** в компоненте появляется собственная ветка разбора `href`
- **THEN** это нарушение контракта: разбор живёт в `lib/link` и общем `LinkRenderer`

### Requirement: Страница, секция и состояния

The system SHALL compose screens from `Page`, `Section`, `DescriptionList`, `List`, `StateMessage` и `Pagination`, and SHALL NOT introduce sibling page, section or list components.

#### Scenario: Заголовок страницы

- **WHEN** странице нужны заголовок, описание, хлебные крошки и действия
- **THEN** они передаются в `PageHeader` как слоты без отдельной вёрстки на месте

#### Scenario: Ведущий элемент на обложке

- **WHEN** у шапки есть и `media`, и `leading`
- **THEN** аватар перекрывает нижнюю кромку баннера на половину своей высоты, а вокруг него кольцо цвета фона

#### Scenario: Фасеты

- **WHEN** нужно показать пары «термин — значение»
- **THEN** используется `DescriptionList` на 1–4 колонки, а `dl` вручную не собирается

#### Scenario: Строки списка

- **WHEN** список строк нужен с ведущим элементом, метаданными или действием
- **THEN** строки строятся на `List`/`ListRow`, а интерактивная строка — ссылка или кнопка

#### Scenario: Выравнивание строки

- **WHEN** у строки есть ведущий элемент и многострочный текст
- **THEN** ведущий элемент прижат к первой строке текста, а не центрируется по всей высоте

#### Scenario: Хлебные крошки в истории

- **WHEN** у `Breadcrumbs` нет собственной истории
- **THEN** это нарушение паритета: у компонента есть ровно одна история, а не только упоминание в шапке `Page`

#### Scenario: Крупный заголовок

- **WHEN** странице нужен заголовок на дисплейном размере, ведущий элемент или медиа
- **THEN** `PageHeader` получает `leading`, `media` и размер заголовка пропсами, а вёрстка остаётся внутри компонента

#### Scenario: Обложка страницы

- **WHEN** в `PageHeader` передан `media`
- **THEN** медиа показывается баннером с фиксированным соотношением сторон и обрезкой по центру, а не картинкой на всю высоту

#### Scenario: Пустое и ошибочное состояние

- **WHEN** данных нет или произошла ошибка
- **THEN** используется `StateMessage` с `tone` `neutral` или `error` и правильной ролью

#### Scenario: Страницы

- **WHEN** список разбит на страницы
- **THEN** навигация — `Pagination` с `page`, `pageCount` и `onPageChange`, а свои кнопки страниц не заводятся

#### Scenario: Готовые раскладки

- **WHEN** нужна страница сущности, профиль, список или прогон тестов
- **THEN** они собираются из `PageHeader`, `Tabs`, `Table`, `List` и `Badge`, а свои компоненты раскладки не появляются

#### Scenario: Страница сущности

- **WHEN** у сущности есть фото
- **THEN** в правой колонке на месте раздела закреплённых показывается фото, а без фото — сетка закреплённых, и обе раскладки собраны только из публичного API

### Requirement: Диалог на нативной основе

The system SHALL build `Dialog` on one native-dialog base with focus restore, Escape handling and labelled title and description, and `AlertDialog` SHALL compose that same base.

#### Scenario: Закрытие

- **WHEN** нажата Escape или кнопка закрытия
- **THEN** диалог закрывается и фокус возвращается на элемент, открывший его

#### Scenario: Подпись

- **WHEN** в диалоге есть `DialogTitle` и `DialogDescription`
- **THEN** они связаны с контейнером как доступное имя и описание

#### Scenario: Подтверждение

- **WHEN** нужно подтверждение опасного действия
- **THEN** `AlertDialog` строится из `Dialog` с ролью `alertdialog`, а второй диалог не пишется

#### Scenario: Кнопки в подвале

- **WHEN** в `DialogFooter` две и больше кнопок
- **THEN** они одного размера и прижаты к правому краю, а не разной высоты и не растянуты на всю ширину

#### Scenario: Галерея

- **WHEN** пользователь открывает фото в `PhotoGallery`
- **THEN** просмотр идёт в `Dialog` с листанием стрелками и доступными подписями

### Requirement: Обратная связь и загрузка

The system SHALL deliver transient messages through `ToastProvider`/`useToast` and file input through `FileUpload`, without new notification or upload components.

#### Scenario: Тост

- **WHEN** компонент вызывает `toast` из `useToast`
- **THEN** только `ToastProvider` рендерит портал с ролью `status`/`alert`, а тон берётся из `ToastTone`

#### Scenario: Тост вне провайдера

- **WHEN** `useToast` вызывается без `ToastProvider`
- **THEN** это ошибка, а не тихий `undefined`

#### Scenario: Файлы

- **WHEN** пользователь выбирает или бросает файлы
- **THEN** `FileUpload` отдаёт их через `onFiles`, а ограничение `maxSize` отбрасывает лишние с сообщением об ошибке

#### Scenario: Зона загрузки

- **WHEN** `FileUpload` отрисован
- **THEN** это прямоугольник с dashed-контуром, иконкой `upload` в кружке и подписью «Нажмите для загрузки или перетащите», а под ней — форматы из `accept` или пропса `formats`

#### Scenario: Действие в тосте

- **WHEN** в `toast` передан `action`
- **THEN** `Button` с `variant="outline"` на размере `s` стоит справа внизу в одной строке с описанием и прижат к его низу, а текст не заезжает под кнопку

#### Scenario: Доступное поле

- **WHEN** `FileUpload` отрисован
- **THEN** у скрытого `input` есть подпись и состояние ошибки по контракту `forms`

### Requirement: Время и тема на уровне приложения

The system SHALL express history through `Timeline` and document theme through `ThemeProvider`/`useTheme`, which set only `data-theme` on the document element.

#### Scenario: Лента событий

- **WHEN** нужно показать последовательность событий
- **THEN** используется `Timeline` с `TimelineItem`, а не отдельный список на каждый экран

#### Scenario: Смена темы

- **WHEN** вызывается `setTheme`
- **THEN** меняется только `data-theme` на `document.documentElement`, без класса `.dark` и второй оси

#### Scenario: Сохранение темы

- **WHEN** передан `storageKey`
- **THEN** выбранная тема сохраняется и восстанавливается; без `storageKey` ничего не пишется в хранилище

#### Scenario: Локальная область

- **WHEN** тема нужна только части страницы
- **THEN** используется `ThemeScope`, а `ThemeProvider` не подменяется вторым механизмом

### Requirement: Сменные значения в Shimmer

The system SHALL let `Shimmer` show changing text through `value`, `values` and `interval`, and SHALL cross-fade the swap instead of replacing the text abruptly.

#### Scenario: Управляемое значение

- **WHEN** задан `value`
- **THEN** показывается именно он, а `values` не крутятся

#### Scenario: Список значений

- **WHEN** задан `values` из двух и более строк
- **THEN** строки меняются каждые `interval` мс (по умолчанию 2600), а `interval <= 0` останавливает ротацию

#### Scenario: Смена значений

- **WHEN** текст меняется
- **THEN** старый слой уезжает вверх и гаснет, новый появляется снизу, а старая строка помечена `aria-hidden`

#### Scenario: Своё движение

- **WHEN** в системе включён `prefers-reduced-motion` или передан `active={false}`
- **THEN** текст меняется без анимации, но остаётся читаемым

### Requirement: Паритет API и Storybook

The system SHALL export every component and part that a story shows in the public API, and SHALL show every public component in exactly one story.

#### Scenario: Часть в Storybook без экспорта

- **WHEN** история использует публичную часть, которой нет в `src/index.ts`
- **THEN** это нарушение контракта: часть добавляется в публичный API

#### Scenario: Публичный компонент без истории

- **WHEN** публичный компонент добавлен в API
- **THEN** у него есть ровно одна история, и `docs/features.md` указывает её раздел и селектор

#### Scenario: Пример вместо API

- **WHEN** часть компонента существует только в истории и не экспортируется
- **THEN** это нарушение паритета: пример не заменяет публичный API

### Requirement: Выбор цвета

The system SHALL provide exactly one `ColorPicker` that renders a radiogroup of swatches and a HEX field, keeps `value`/`onChange`, normalizes HEX and supports arrow-key navigation, and SHALL NOT add a sibling colour picker.

#### Scenario: Свотч и HEX

- **WHEN** пользователь выбирает цвет свотчем или вводит HEX
- **THEN** `onChange` получает нормализованный `#rrggbb`, сокращённый `#rgb` разворачивается, а невалидное значение не отправляется

#### Scenario: Клавиатура

- **WHEN** фокус на свотче и нажата стрелка, Home или End
- **THEN** выбор переезжает по палитре, а `aria-checked` отмечает выбранный цвет в `radiogroup`

### Requirement: Выбор темы по основному цвету

The system SHALL provide exactly one `ThemePicker` that reads themes from `useTheme`, shows each theme's primary color as a swatch resolved inside that theme's own `data-theme` scope, and switches the theme through `setTheme` without writing `data-theme`, `--tb-accent` or storage itself.

#### Scenario: Свотч берётся из темы

- **WHEN** `ThemePicker` отрисован
- **THEN** кружок каждой темы окрашен ролью `--tb-primary` в собственном `data-theme`-scope, и в TSX нет ни одного литерального цвета темы

#### Scenario: Два варианта

- **WHEN** `variant` равен `dots`
- **THEN** видны только кружки, а название темы доступно через `aria-label` и `title`; при `variant="named"` рядом с кружком стоит название темы

#### Scenario: Выбор темы

- **WHEN** пользователь нажимает на кружок
- **THEN** `setTheme` провайдера получает значение темы, `aria-pressed` отмечает выбранную, а акцент и хранилище компонент не трогает

### Requirement: Divider без собственных отступов

The system SHALL render `Divider` as a hairline with no vertical margin, so symmetric spacing above and below is owned by the container (`Stack` gap or block padding) and is never baked into the divider.

#### Scenario: Одинаковые отступы

- **WHEN** `Divider` стоит между блоками в контейнере с `gap`
- **THEN** отступ сверху и снизу одинаковый, и демонстрация не добавляет односторонний padding
