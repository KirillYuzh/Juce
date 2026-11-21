import { spawn } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const noServer = args.includes('--no-server');
const passthrough = args.filter((arg) => arg !== '--no-server');
const url =
  process.env.BOMBADIL_URL ??
  'http://localhost:6006/iframe.html?id=chat-conversation--conversation&viewMode=story';
const spec = path.join('bombadil', 'chat.spec.ts');

async function reachable() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok;
  } catch {
    return false;
  }
}

let server;

function stopServer() {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, 'SIGTERM');
  } catch {
    server.kill('SIGTERM');
  }
}

if (!noServer && !(await reachable())) {
  console.log('Storybook не запущен, поднимаю на 6006…');
  server = spawn('npm', ['run', 'storybook', '--', '--ci', '--quiet'], {
    stdio: 'inherit',
    detached: true,
  });

  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (await reachable()) break;
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  if (!(await reachable())) {
    console.error('Storybook не поднялся за 120 секунд.');
    stopServer();
    process.exit(1);
  }
}

const child = spawn(
  path.join('node_modules', '.bin', 'bombadil'),
  [
    'browser',
    'test',
    '--headless',
    '--time-limit=45s',
    '--exit-on-violation',
    ...passthrough,
    url,
    spec,
  ],
  { stdio: 'inherit' }
);

const finish = (code) => {
  stopServer();
  process.exit(code ?? 0);
};

child.on('exit', (code) => finish(code));
process.on('SIGINT', () => {
  child.kill('SIGINT');
  finish(130);
});
