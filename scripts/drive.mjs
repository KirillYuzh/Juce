import fs from 'node:fs';
import path from 'node:path';

const DEFAULTS = { port: '9222', base: 'http://localhost:5173', timeout: '5000' };

const argv = process.argv.slice(2);
const flags = {};
const args = [];

for (let index = 0; index < argv.length; index += 1) {
  const value = argv[index];
  if (value.startsWith('--')) {
    flags[value.slice(2)] = argv[index + 1];
    index += 1;
  } else {
    args.push(value);
  }
}

const port = flags.port ?? DEFAULTS.port;
const base = flags.base ?? DEFAULTS.base;
const timeout = Number(flags.timeout ?? DEFAULTS.timeout);

class Cdp {
  #socket;
  #counter = 0;
  #pending = new Map();

  constructor(socket) {
    this.#socket = socket;
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const entry = message.id ? this.#pending.get(message.id) : undefined;
      if (!entry) return;
      this.#pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
    });
  }

  send(method, params = {}) {
    const id = (this.#counter += 1);
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject });
      this.#socket.send(JSON.stringify({ id, method, params }));
    });
  }
}

async function connect() {
  let targets;
  try {
    targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
  } catch {
    throw new Error(
      `Нет CDP на порту ${port}. Запусти Chrome с --remote-debugging-port=${port} и --user-data-dir во временной папке.`
    );
  }

  const pages = targets.filter(
    (target) => target.type === 'page' && !target.url.startsWith('devtools://')
  );
  const origin = new URL(base).origin;
  const page = pages.find((target) => target.url.startsWith(origin)) ?? pages[0];
  if (!page) throw new Error('В Chrome нет открытой вкладки (page target).');

  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener(
      'error',
      () => reject(new Error('Не удалось подключиться по WebSocket.')),
      {
        once: true,
      }
    );
  });

  const cdp = new Cdp(socket);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return cdp;
}

async function evaluate(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
  }
  return result.value;
}

const selector = (value) => JSON.stringify(value);

async function waitFor(cdp, expression, limit) {
  const deadline = Date.now() + limit;
  while (Date.now() < deadline) {
    if (await evaluate(cdp, expression)) return true;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return false;
}

const commands = {
  async open(cdp, target) {
    const url = target.startsWith('http') ? target : `${base}/${target}`;
    await cdp.send('Page.navigate', { url });
    const ready = await waitFor(
      cdp,
      "document.readyState === 'complete' && (document.getElementById('root')?.childElementCount ?? 0) > 0",
      timeout
    );
    if (!ready) throw new Error(`Страница не отрисовалась за ${timeout} мс: ${url}`);
    return url;
  },

  async url(cdp) {
    return evaluate(cdp, 'location.href');
  },

  async click(cdp, target) {
    const expression = `(() => {
      const el = document.querySelector(${selector(target)});
      if (!el) throw new Error('Не найден: ${target.replace(/'/g, "\\'")}');
      el.scrollIntoView({ block: 'center' });
      el.click();
      return true;
    })()`;
    return evaluate(cdp, expression);
  },

  async type(cdp, target, text) {
    const expression = `(() => {
      const el = document.querySelector(${selector(target)});
      if (!el) throw new Error('Не найден: ${target.replace(/'/g, "\\'")}');
      const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${selector(text)});
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return el.value;
    })()`;
    return evaluate(cdp, expression);
  },

  async text(cdp, target) {
    return evaluate(
      cdp,
      `document.querySelector(${selector(target)})?.textContent?.trim() ?? null`
    );
  },

  async attr(cdp, target, name) {
    return evaluate(
      cdp,
      `document.querySelector(${selector(target)})?.getAttribute(${selector(name)}) ?? null`
    );
  },

  async exists(cdp, target) {
    return evaluate(cdp, `Boolean(document.querySelector(${selector(target)}))`);
  },

  async wait(cdp, target) {
    const found = await waitFor(
      cdp,
      `Boolean(document.querySelector(${selector(target)}))`,
      timeout
    );
    if (!found) throw new Error(`Элемент не появился за ${timeout} мс: ${target}`);
    return true;
  },

  async viewport(cdp, width, height) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: Number(width),
      height: Number(height),
      deviceScaleFactor: 1,
      mobile: false,
    });
    return { width: Number(width), height: Number(height) };
  },

  async eval(cdp, expression) {
    return evaluate(cdp, expression);
  },

  async screenshot(cdp, file) {
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'png' });
    const target = path.resolve(file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, Buffer.from(data, 'base64'));
    return target;
  },
};

const [command, ...rest] = args;

if (!command || command === 'help' || command === '--help') {
  console.log(`Использование: npm run drive -- <команда> [аргументы] [--port 9222] [--base http://localhost:5173] [--timeout 5000]

  open <path>              открыть путь, например #/assistant
  url                      текущий адрес
  click <selector>         кликнуть по элементу
  type <selector> <text>   ввести текст в input/textarea
  text <selector>          прочитать текст
  attr <selector> <name>   прочитать атрибут
  exists <selector>        true/false
  wait <selector>          ждать появления элемента
  viewport <w> <h>         задать размер окна
  eval <expression>        выполнить JS в странице
  screenshot <file>        сохранить PNG

Пример:
  npm run drive -- open '#/assistant'
  npm run drive -- click 'button[aria-label="Отправить"]'
  npm run drive -- screenshot artifacts/assistant.png`);
  process.exit(0);
}

const handler = commands[command];
if (!handler) {
  console.error(`Неизвестная команда: ${command}. Запусти без аргументов, чтобы увидеть справку.`);
  process.exit(2);
}

const cdp = await connect();
const result = await handler(cdp, ...rest);
if (typeof result === 'string') console.log(result);
else console.log(JSON.stringify(result));
process.exit(result === false ? 1 : 0);
