# Карта фич

Функции с точки зрения пользователя: где находятся, как открыть, чем проверить. Селекторы проверены драйвером из `docs/runtime.md`.

| Фича                | Где                               | Как открыть                          | Как проверить                                                                                           |
| ------------------- | --------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Главная             | `src/pages/HomePage.tsx`          | `#/`                                 | `exists 'header'`, `text 'h1'`                                                                          |
| Шапка с меню        | `components/blocks/Header.tsx`    | есть на обеих страницах              | `viewport 390 844`, затем `exists 'nav[aria-label="Мобильное меню"]'`                                   |
| Кнопка поиска       | `Header`                          | иконка в шапке                       | `exists 'button[aria-label="Поиск"]'`                                                                   |
| Ассистент           | `src/pages/AssistantPage.tsx`     | `#/assistant`                        | `exists 'textarea[aria-label="Сообщение ассистенту"]'`                                                  |
| Список диалогов     | `components/ai/ChatList.tsx`      | Storybook `Chat/Sidebar`             | поиск, выбор, удаление в два шага, скелетоны                                                            |
| Рабочее место чата  | `components/ai/ChatLayout.tsx`    | Storybook `Chat/Conversation`        | свернуть и развернуть сайдбар, выбрать диалог, отправить сообщение                                      |
| Отправка сообщения  | `components/ai/Chat.tsx`          | `#/assistant`                        | `type 'textarea' '...'`, `click 'button[aria-label="Отправить сообщение"]'`, `wait '[data-message-id]'` |
| Остановка стрима    | `Chat`                            | пока идёт ответ                      | `exists 'button[aria-label="Остановить ответ"]'`                                                        |
| Копирование ответа  | `Chat` → `useCopy`                | под ответом ассистента               | `click 'button[aria-label="Скопировать ответ"]'`, затем `text` кнопки = `Скопировано`                   |
| Причина и источники | `Reasoning`, `Sources`            | в демо-ответе                        | `exists 'text'` внутри блока рассуждений                                                                |
| Markdown в ответе   | `components/ai/Markdown.tsx`      | демо-ответ                           | `exists 'table'` в ответе ассистента                                                                    |
| Тема                | `styles/tokens.css`               | `data-theme` на `<html>`             | `eval "document.documentElement.dataset.theme = 'dark'"`                                                |
| Куки-баннер         | `components/ui/Feedback.tsx`      | `#/`                                 | `exists '[aria-label="Использование куки"]'`                                                            |
| Карусель            | `components/ui/Carousel.tsx`      | Storybook `Primitives/Carousel`      | крутить стрелками, менять dots                                                                          |
| Вопросник           | `components/ui/Questionnaire.tsx` | Storybook `Primitives/Questionnaire` | пройти шаги, проверить фокус и прогресс                                                                 |
| Дата-пикер          | `components/ui/date-picker`       | Storybook `Primitives/Date picker`   | открыть, выбрать диапазон, проверить клавиатуру                                                         |
| Код с подсветкой    | `components/ui/code-block`        | Storybook `Primitives/Code block`    | копирование и номера строк                                                                              |
| Графики             | `components/ui/charts`            | Storybook `Primitives/Charts/Bar`    | тултипы и легенда                                                                                       |
| Сайдбар             | `components/ui/Sidebar.tsx`       | Storybook `Primitives/Sidebar`       | `Ctrl/Cmd+B`, мобильный оверлей                                                                         |
| Resizable           | `components/ui/Resizable.tsx`     | Storybook `Primitives/Resizable`     | тянуть разделитель, проверить min/max                                                                   |

Storybook открывается на `http://localhost:6006`, каждый пункт — отдельная фича с состояниями и a11y-панелью.
