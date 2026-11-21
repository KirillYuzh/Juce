# Рантайм для агента

Всё, что нужно, чтобы запустить приложение и проверить изменение руками или из CLI.

## Запуск

| Что | Команда | Адрес |
| --- | --- | --- |
| Демо | `npm run dev` | http://localhost:5173 |
| Storybook | `npm run storybook` | http://localhost:6006 |
| Собранное демо | `npm run build && npx vite preview` | http://localhost:4173 |

Маршруты демо: `#/` — главная, `#/assistant` — ассистент. Учётных записей, бэкенда и тестовых пользователей нет. Весь контент лежит в `src/data`, изображения — в `public`.

## Драйвер

Драйвер говорит с Chrome по CDP и не тянет браузерных зависимостей.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/juce-cdp \
  --no-first-run \
  about:blank
```

```bash
npm run drive -- open '#/assistant'
npm run drive -- exists 'textarea'
npm run drive -- click 'button[aria-label^="Отправить"]'
npm run drive -- wait '[data-message-id]'
npm run drive -- text '[data-message-id]'
npm run drive -- viewport 390 844
npm run drive -- screenshot artifacts/assistant-mobile.png
```

Команды: `open`, `url`, `click`, `type`, `text`, `attr`, `exists`, `wait`, `viewport`, `eval`, `screenshot`. Флаги: `--port`, `--base`, `--timeout`.

## Артефакты

Скриншоты и видео складывай в `artifacts/` (папка в `.gitignore`). Прикладывай их к каждой правке UI: ревью идёт по артефактам, а не по диффу.
