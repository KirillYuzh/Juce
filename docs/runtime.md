# Рантайм для агента

Всё, что нужно, чтобы запустить приложение и проверить изменение руками или из CLI.

## Запуск

| Что            | Команда                             | Адрес                 |
| -------------- | ----------------------------------- | --------------------- |
| Демо           | `npm run dev`                       | http://localhost:5173 |
| Storybook      | `npm run storybook`                 | http://localhost:6006 |
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

Драйвер понимает и демо (`#/...`), и Storybook (`--base http://localhost:6006` и путь `iframe.html?id=...`).

## Bombadil

Property-based фаззинг UI. Спека `bombadil/chat.spec.ts` проверяет, что строки списка чатов не выходят за границы списка и страница не получает горизонтальный скролл. Это регрессия на сдвиг строки вправо при выборе.

```bash
npm run test:bombadil                # поднимет Storybook на 6006 и прогонит 45 секунд
npm run test:bombadil -- --no-server # если Storybook уже запущен
BOMBADIL_URL=... npm run test:bombadil
```

В `npm run check` не входит: нужен браузер и живой Storybook, прогон дольше юнит-тестов. Запускай перед PR, который трогает чат.

## Артефакты

Скриншоты и видео складывай в `artifacts/` (папка в `.gitignore`). Прикладывай их к каждой правке UI: ревью идёт по артефактам, а не по диффу.
