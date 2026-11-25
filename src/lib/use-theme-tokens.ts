import { useEffect, useState } from 'react';

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

const EMPTY: ThemeTokens = { bg: '', text: '', accent: '', primary: '', dark: false };

const PROBE_STYLE =
  'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';

let hexProbe: CanvasRenderingContext2D | null = null;
const hexCache = new Map<string, string>();

// canvas/esm-библиотеки принимают hex и rgb(), а тема может выдать oklch/color():
// приводим всё к hex, чтобы цветовые пропсы не зависели от того, чем записан токен
function toHex(color: string): string {
  if (!color) return color;
  const cached = hexCache.get(color);
  if (cached) return cached;
  hexProbe ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!hexProbe) return color;
  hexProbe.clearRect(0, 0, 1, 1);
  hexProbe.fillStyle = color;
  hexProbe.fillRect(0, 0, 1, 1);
  const [r, g, b] = hexProbe.getImageData(0, 0, 1, 1).data;
  const value = `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
  hexCache.set(color, value);
  return value;
}

function read(element: HTMLElement): ThemeTokens {
  const probe = document.createElement('span');
  probe.style.cssText = PROBE_STYLE;
  element.appendChild(probe);
  const style = getComputedStyle(probe);
  const color = (role: string) => {
    probe.style.color = `var(${role})`;
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
  return tokens;
}

export function useThemeTokens(host: HTMLElement | null): ThemeTokens {
  const [tokens, setTokens] = useState<ThemeTokens>(EMPTY);

  useEffect(() => {
    const target = host ?? document.documentElement;
    const sync = () => setTokens(read(target));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [host]);

  return tokens;
}
