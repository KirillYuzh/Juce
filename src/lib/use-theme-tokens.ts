import { useEffect, useLayoutEffect, useState } from 'react';

export interface ThemeTokens {
  bg: string;
  text: string;
  accent: string;
  primary: string;
  dark: boolean;
}

const ROLES = {
  bg: '--tb-bg',
  text: '--tb-text-primary',
  accent: '--tb-accent',
  primary: '--tb-primary',
} as const;

// Пустая строка — «токен не разрешился». Компонент обязан не рисовать таким
// цветом: пустое значение не должно превращаться в чёрную заливку.
const EMPTY: ThemeTokens = { bg: '', text: '', accent: '', primary: '', dark: false };

const PROBE_STYLE =
  'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';

// var(--role, SENTINEL): необъявленный токен даёт sentinel вместо наследования
// цвета хоста, поэтому неразрешённый токен видно, а не путается с валидным цветом.
const SENTINEL = 'rgb(1, 2, 3)';
const SENTINEL_FILL = '#010203';
const HEX_CACHE_LIMIT = 256;

let hexProbe: CanvasRenderingContext2D | null = null;
const hexCache = new Map<string, string>();

// canvas/esm-библиотеки принимают hex и rgb(), а тема может выдать oklch/color():
// приводим всё к hex, чтобы цветовые пропсы не зависели от того, чем записан токен.
// Альфа меньше единицы уходит в hex8, иначе прозрачность токена теряется.
// Возвращает '' для пустого и невалидного цвета.
function toHex(color: string): string {
  if (!color) return '';
  const cached = hexCache.get(color);
  if (cached !== undefined) return cached;
  hexProbe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!hexProbe) return color;
  hexProbe.clearRect(0, 0, 1, 1);
  hexProbe.fillStyle = SENTINEL_FILL;
  hexProbe.fillStyle = color;
  hexProbe.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = hexProbe.getImageData(0, 0, 1, 1).data;
  const value =
    r === 1 && g === 2 && b === 3 && a === 255
      ? ''
      : `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}${
          a < 255 ? a.toString(16).padStart(2, '0') : ''
        }`;
  if (hexCache.size >= HEX_CACHE_LIMIT) {
    const [oldest] = hexCache.keys();
    if (oldest !== undefined) hexCache.delete(oldest);
  }
  hexCache.set(color, value);
  return value;
}

const scopeCache = new WeakMap<HTMLElement, { key: string; tokens: ThemeTokens }>();

function read(element: HTMLElement): ThemeTokens {
  const scope = (element.closest('[data-theme]') ?? document.documentElement) as HTMLElement;
  const key = scope.getAttribute('data-theme') ?? '';
  const cached = scopeCache.get(scope);
  if (cached?.key === key) return cached.tokens;
  const probe = document.createElement('span');
  probe.style.cssText = PROBE_STYLE;
  element.appendChild(probe);
  const style = getComputedStyle(probe);
  const color = (role: string) => {
    probe.style.color = `var(${role}, ${SENTINEL})`;
    return toHex(style.color);
  };
  const tokens: ThemeTokens = {
    bg: color(ROLES.bg),
    text: color(ROLES.text),
    accent: color(ROLES.accent),
    primary: color(ROLES.primary),
    dark: style.colorScheme === 'dark',
  };
  probe.remove();
  scopeCache.set(scope, { key, tokens });
  return tokens;
}

const same = (a: ThemeTokens, b: ThemeTokens) =>
  a.bg === b.bg &&
  a.text === b.text &&
  a.accent === b.accent &&
  a.primary === b.primary &&
  a.dark === b.dark;

type Listener = () => void;
const listeners = new Set<Listener>();
let observer: MutationObserver | null = null;

// Один MutationObserver на документ на модуль: смена data-theme сбрасывает кеш
// по теме и будит всех подписчиков, а не по наблюдателю на каждый инстанс.
function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  observer ??= new MutationObserver(() => {
    for (const item of listeners) item();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
    subtree: true,
  });
  return () => {
    listeners.delete(listener);
    if (listeners.size) return;
    observer?.disconnect();
    observer = null;
  };
}

// Значение читается до первого paint; на сервере layout-эффект недоступен.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function useThemeTokens(host: HTMLElement | null): ThemeTokens {
  const [tokens, setTokens] = useState<ThemeTokens>(EMPTY);

  useIsoLayoutEffect(() => {
    const target = host ?? document.documentElement;
    const sync = () =>
      setTokens((previous) => {
        const next = read(target);
        return same(previous, next) ? previous : next;
      });
    sync();
    return subscribe(sync);
  }, [host]);

  return tokens;
}
