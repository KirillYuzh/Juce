import { converter, parse } from 'culori';

const toOklab = converter('oklab');
const toRgb = converter('rgb');

export const WHITE = { mode: 'rgb', r: 1, g: 1, b: 1, alpha: 1 };

export const oklch = (value) => converter('oklch')(value);
export const hueOf = (value) => oklch(value).h ?? 0;
export const lightnessOf = (value) => oklch(value).l;
export const chromaOf = (value) => oklch(value).c ?? 0;
export const clamp = (value) => Math.min(1, Math.max(0, value));

export function parseTokens(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import[^;]+;/g, '');
  const found = [];
  let index = 0;

  while (index < clean.length) {
    const open = clean.indexOf('{', index);
    if (open === -1) break;

    let depth = 1;
    let cursor = open + 1;
    while (cursor < clean.length && depth > 0) {
      if (clean[cursor] === '{') depth += 1;
      else if (clean[cursor] === '}') depth -= 1;
      cursor += 1;
    }

    const selector = clean.slice(index, open).trim();
    if (!selector.startsWith('@'))
      found.push({ selector, body: clean.slice(open + 1, cursor - 1) });
    index = cursor;
  }

  return found;
}

export function declarations(body) {
  const result = new Map();
  for (const chunk of body.split(';')) {
    const at = chunk.indexOf(':');
    if (at === -1) continue;
    const name = chunk.slice(0, at).trim();
    if (name.startsWith('--')) result.set(name, chunk.slice(at + 1).trim());
  }
  return result;
}

function matches(selector, theme) {
  return (
    selector === ':root' ||
    selector === '[data-theme]' ||
    selector === '[data-skin]' ||
    selector === `[data-theme='${theme}']`
  );
}

export function themeTokens(rules, theme) {
  const result = new Map();

  for (const rule of rules) {
    const hit = rule.selector
      .split(',')
      .map((selector) => selector.trim())
      .some((selector) => matches(selector, theme));
    if (!hit) continue;
    for (const [name, value] of declarations(rule.body)) result.set(name, value);
  }

  return result;
}

export function declaredTheme(rules, theme) {
  const names = new Set();

  for (const rule of rules) {
    const hit = rule.selector
      .split(',')
      .map((selector) => selector.trim())
      .some((selector) => matches(selector, theme));
    if (!hit) continue;
    for (const name of declarations(rule.body).keys()) names.add(name);
  }

  return names;
}

function splitTop(value) {
  const parts = [];
  let depth = 0;
  let current = '';

  for (const char of value) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  parts.push(current.trim());
  return parts;
}

export function resolveColor(tokens, value, seen = new Set()) {
  const trimmed = value.trim();

  if (trimmed.startsWith('color-mix(')) {
    const parts = splitTop(trimmed.slice('color-mix('.length, -1));
    if (parts.length !== 3) return null;

    const sides = parts.slice(1).map((part) => {
      const match = part.match(/^(.*?)\s+([\d.]+)%$/);
      return {
        value: (match ? match[1] : part).trim(),
        weight: match ? Number(match[2]) / 100 : 0.5,
      };
    });

    const left = resolveColor(tokens, sides[0].value, seen);
    const right = resolveColor(tokens, sides[1].value, seen);
    if (!left || !right) return null;

    const total = sides[0].weight + sides[1].weight;
    if (total === 0) return null;

    const w1 = sides[0].weight / total;
    const w2 = sides[1].weight / total;
    const alpha = w1 * left.alpha + w2 * right.alpha;
    const channel = (first, second) =>
      alpha === 0 ? 0 : (w1 * first * left.alpha + w2 * second * right.alpha) / alpha;

    const left_ = toOklab(left);
    const right_ = toOklab(right);
    const mixed = toRgb({
      mode: 'oklab',
      l: channel(left_.l, right_.l),
      a: channel(left_.a, right_.a),
      b: channel(left_.b, right_.b),
      alpha,
    });

    return { mode: 'rgb', r: mixed.r, g: mixed.g, b: mixed.b, alpha: mixed.alpha ?? 1 };
  }

  if (trimmed.startsWith('var(')) {
    const [name, fallback] = splitTop(trimmed.slice('var('.length, -1));
    if (seen.has(name)) return null;

    const next = new Set(seen).add(name);
    const resolved = tokens.get(name);
    if (resolved !== undefined) return resolveColor(tokens, resolved, next);
    return fallback === undefined ? null : resolveColor(tokens, fallback, next);
  }

  const parsed = parse(trimmed);
  if (!parsed) return null;

  const rgb = toRgb(parsed);
  return { mode: 'rgb', r: rgb.r, g: rgb.g, b: rgb.b, alpha: rgb.alpha ?? 1 };
}

function linear(value) {
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function luminance(value) {
  const { r, g, b } = toRgb(value);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrastRatio(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function compositeOver(foreground, background) {
  const alpha = foreground.alpha;
  return {
    mode: 'rgb',
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    alpha: 1,
  };
}

export function inGamut(value) {
  const { r, g, b } = toRgb(value);
  return [r, g, b].every((channel) => channel >= -0.001 && channel <= 1.001);
}

export function clampToGamut(value) {
  const hue = hueOf(value);
  const lightness = lightnessOf(value);
  let chroma = chromaOf(value);

  while (chroma > 0 && !inGamut({ mode: 'oklch', l: lightness, c: chroma, h: hue }))
    chroma -= 0.004;
  return { mode: 'oklch', l: lightness, c: Math.max(0, chroma), h: hue };
}

export function cssColor(value) {
  const { l, c, h } = oklch(value);
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${(h ?? 0).toFixed(2)})`;
}

export function shift(value, delta, chroma = chromaOf(value), hue = hueOf(value)) {
  return clampToGamut({ mode: 'oklch', l: clamp(lightnessOf(value) + delta), c: chroma, h: hue });
}

export function closestPassing(backdrops, hue, chroma, target) {
  const towardsLight = luminance(backdrops[0]) > 0.5;
  let low = 0;
  let high = 1;

  for (let step = 0; step < 40; step += 1) {
    const middle = (low + high) / 2;
    const candidate = clampToGamut({ mode: 'oklch', l: middle, c: chroma, h: hue });
    const passes = backdrops.every((backdrop) => contrastRatio(candidate, backdrop) >= target);
    if (towardsLight === passes) low = middle;
    else high = middle;
  }

  return clampToGamut({ mode: 'oklch', l: towardsLight ? low : high, c: chroma, h: hue });
}

export function ensureContrast(fill, text, target) {
  const towardsDark = luminance(text) > 0.5;
  let lightness = lightnessOf(fill);

  for (let step = 0; step < 100; step += 1) {
    const candidate = clampToGamut({
      mode: 'oklch',
      l: lightness,
      c: chromaOf(fill),
      h: hueOf(fill),
    });
    if (contrastRatio(candidate, text) >= target) return candidate;
    const next = clamp(lightness + (towardsDark ? -0.01 : 0.01));
    if (next === lightness) return candidate;
    lightness = next;
  }

  return clampToGamut({ mode: 'oklch', l: lightness, c: chromaOf(fill), h: hueOf(fill) });
}

export function bestText(backdrop, light, dark) {
  return contrastRatio(light, backdrop) >= contrastRatio(dark, backdrop) ? light : dark;
}

export function keepContrast(fill, text, delta) {
  const up = shift(fill, delta);
  const down = shift(fill, -delta);
  return contrastRatio(up, text) >= contrastRatio(down, text) ? up : down;
}
