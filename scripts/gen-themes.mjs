import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  bestText,
  chromaOf,
  clampToGamut,
  closestPassing,
  contrastRatio,
  cssColor,
  ensureContrast,
  hueOf,
  lightnessOf,
  oklch,
  shift,
} from './theme-color.mjs';

const PALETTES = [
  {
    name: 'wasabi',
    title: 'Wasabi',
    mode: 'light',
    bg: '#FBFCF8',
    surface: '#FFFFFF',
    text: '#232A24',
    primary: '#26332A',
    accent: '#9DB07A',
    link: '#42654C',
    extra: ['#42654C', '#BDB6C9'],
  },
  {
    name: 'wasabi-dark',
    title: 'Wasabi Dark',
    mode: 'dark',
    bg: '#191D1A',
    surface: '#232824',
    text: '#E7ECE7',
    primary: '#DDE6D8',
    accent: '#A6BC7F',
    link: '#9CC9A6',
    extra: ['#8FB09A', '#C4BDD0'],
  },
];

const CSS_PATH = fileURLToPath(new URL('../src/styles/themes.css', import.meta.url));
const TS_PATH = fileURLToPath(new URL('../src/styles/themes.ts', import.meta.url));

const color = (l, c, h) => ({ mode: 'oklch', l, c, h });

function build(palette) {
  const dark = palette.mode === 'dark';
  const bg = clampToGamut(oklch(palette.bg));
  const surface = clampToGamut(oklch(palette.surface));
  const tint = Math.min(Math.max(chromaOf(palette.text) * 3, 0.008), 0.032);
  const hue = chromaOf(palette.bg) >= 0.01 ? hueOf(palette.bg) : hueOf(palette.text);
  const inkHue = hueOf(palette.text);
  const inkChroma = Math.min(chromaOf(palette.text), 0.04);
  const direction = dark ? 1 : -1;

  const white = color(0.995, Math.min(tint * 0.2, 0.008), hue);
  const black = color(0.16, 0.02, inkHue);
  const inverse = color(0.985, Math.min(tint * 0.2, 0.008), hue);

  const bgSecondary = shift(bg, direction * 0.028, tint * 0.25, hue);
  const bgTertiary = shift(bg, direction * 0.07, tint * 0.42, hue);
  const bgHover = shift(bg, direction * 0.035, tint * 0.35, hue);
  const field = shift(bg, direction * (dark ? 0.03 : 0.065), tint * 0.45, hue);
  const fieldHover = shift(field, direction * 0.025, tint * 0.45, hue);
  const optionSelected = shift(field, dark ? 0.05 : -0.035, tint * 0.4, hue);
  const border = shift(bg, direction * (dark ? 0.115 : 0.1), tint * 0.2, hue);
  const borderStrong = shift(bg, direction * (dark ? 0.27 : 0.24), tint * 0.42, hue);

  const backdrops = [bg, surface, bgSecondary];

  const textPrimary = clampToGamut(oklch(palette.text));
  const textSecondary = closestPassing(backdrops, inkHue, inkChroma, 5.2);
  const textMuted = closestPassing(backdrops, inkHue, inkChroma, 5);
  const textTertiary = closestPassing(backdrops, inkHue, inkChroma, 3.2);

  const borderControl = closestPassing(
    [bg, surface, field],
    inkHue,
    Math.min(inkChroma, 0.02),
    3.1
  );

  const primarySeed = clampToGamut(oklch(palette.primary));
  const primaryVisible =
    contrastRatio(primarySeed, bg) >= 3 ? primarySeed : ensureContrast(primarySeed, bg, 3);
  const onPrimary = bestText(primaryVisible, white, black);
  const primaryFill = ensureContrast(primaryVisible, onPrimary, 5);

  const accentSeed = clampToGamut(oklch(palette.accent));
  const onAccent = bestText(accentSeed, white, black);
  const accentFill = ensureContrast(accentSeed, onAccent, 5);

  const linkSeed = clampToGamut(oklch(palette.link));
  const link = backdrops.every((backdrop) => contrastRatio(linkSeed, backdrop) >= 4.5)
    ? linkSeed
    : closestPassing(backdrops, hueOf(linkSeed), chromaOf(linkSeed), 5);

  const accentHue = hueOf(accentFill);
  const accentChroma = Math.min(chromaOf(accentFill), 0.12);
  const accentText = closestPassing(backdrops, accentHue, accentChroma, 5);
  const extras = palette.extra.map((value) => clampToGamut(oklch(value)));

  const status = (statusHue, chroma) => ({
    fill: closestPassing([bg], statusHue, chroma, 2.6),
    text: closestPassing(backdrops, statusHue, chroma, 5),
  });

  const success = status(148, 0.13);
  const error = status(27, 0.16);
  const warning = status(82, 0.13);

  const chart = [...extras, accentFill, success.fill];
  while (chart.length < 4) chart.push(success.fill);

  const inkLightness = lightnessOf(textPrimary);
  const graySteps = [0.07, 0.11, 0.15, 0.19, 0.24, 0.42, 0.64];
  const grays = graySteps.map((step) =>
    color(lightnessOf(bg) + (inkLightness - lightnessOf(bg)) * step, tint * 0.35, hue)
  );

  const translucent = (value, amount) =>
    `color-mix(in oklab, ${cssColor(value)} ${amount}%, transparent)`;

  const shadows = dark
    ? '0 25px 15px rgb(0 0 0 / 0.32), 0 11px 11px rgb(0 0 0 / 0.36), 0 3px 6px rgb(0 0 0 / 0.42)'
    : '0 25px 15px rgb(0 0 0 / 0.12), 0 11px 11px rgb(0 0 0 / 0.14), 0 3px 6px rgb(0 0 0 / 0.16)';

  return {
    'color-scheme': dark ? 'dark' : 'light',
    '--tb-primary': cssColor(primaryFill),
    '--tb-primary-hover': cssColor(shift(primaryFill, dark ? 0.04 : -0.04)),
    '--tb-primary-active': cssColor(shift(primaryFill, dark ? 0.08 : -0.08)),
    '--tb-on-primary': cssColor(onPrimary),
    '--tb-secondary': cssColor(shift(bg, direction * 0.12, tint * 0.95, hue)),
    '--tb-secondary-hover': cssColor(shift(bg, direction * 0.135, tint * 0.95, hue)),
    '--tb-secondary-soft': cssColor(shift(bg, direction * 0.12, tint * 0.95, hue)),
    '--tb-accent': cssColor(accentFill),
    '--tb-accent-hover': cssColor(
      shift(accentFill, dark ? 0.04 : -0.04, chromaOf(accentFill))
    ),
    '--tb-accent-soft': translucent(accentFill, 16),
    '--tb-accent-text': cssColor(accentText),
    '--tb-accent-text-hover': cssColor(shift(accentText, dark ? 0.05 : -0.05, accentChroma)),
    '--tb-accent-on-inverse': cssColor(accentFill),
    '--tb-on-accent': cssColor(onAccent),
    '--tb-white': cssColor(white),
    '--tb-black': cssColor(black),
    '--tb-dark': cssColor(dark ? shift(bg, -0.06, tint * 0.4, hue) : textPrimary),
    '--tb-dark-soft': cssColor(
      dark ? shift(bg, -0.03, tint * 0.4, hue) : shift(textPrimary, 0.06, inkChroma)
    ),
    '--tb-gray-100': cssColor(grays[0]),
    '--tb-gray-150': cssColor(grays[1]),
    '--tb-gray-200': cssColor(grays[2]),
    '--tb-gray-250': cssColor(grays[3]),
    '--tb-gray-300': cssColor(grays[4]),
    '--tb-gray-400': cssColor(grays[5]),
    '--tb-gray-500': cssColor(grays[5]),
    '--tb-gray-600': cssColor(grays[6]),
    '--tb-text-primary': cssColor(textPrimary),
    '--tb-text-secondary': cssColor(textSecondary),
    '--tb-text-tertiary': cssColor(textTertiary),
    '--tb-text-muted': cssColor(textMuted),
    '--tb-text-inverse': cssColor(inverse),
    '--tb-text-inverse-secondary': translucent(inverse, 68),
    '--tb-text-inverse-tertiary': translucent(inverse, 52),
    '--tb-text-inverse-link': cssColor(accentFill),
    '--link': cssColor(link),
    '--tb-text-link': cssColor(link),
    '--tb-text-link-hover': cssColor(shift(link, dark ? 0.04 : -0.04, chromaOf(link))),
    '--tb-bg': cssColor(bg),
    '--tb-surface': cssColor(surface),
    '--tb-bg-secondary': cssColor(bgSecondary),
    '--tb-bg-tertiary': cssColor(bgTertiary),
    '--tb-bg-hover': cssColor(bgHover),
    '--tb-field': cssColor(field),
    '--tb-field-hover': cssColor(fieldHover),
    '--tb-option-hover': cssColor(fieldHover),
    '--tb-option-selected': cssColor(optionSelected),
    '--tb-success': cssColor(success.fill),
    '--tb-success-text': cssColor(success.text),
    '--tb-success-soft': translucent(success.fill, 16),
    '--tb-error': cssColor(error.fill),
    '--tb-error-text': cssColor(error.text),
    '--tb-error-soft': translucent(error.fill, 16),
    '--tb-warning': cssColor(warning.fill),
    '--tb-warning-text': cssColor(warning.text),
    '--tb-border': cssColor(border),
    '--tb-border-strong': cssColor(borderStrong),
    '--tb-border-control': cssColor(borderControl),
    '--tb-border-inverse': translucent(inverse, 22),
    '--tb-border-on-primary': translucent(onPrimary, 32),
    '--tb-overlay': dark ? 'rgb(0 0 0 / 0.68)' : 'rgb(0 0 0 / 0.5)',
    '--tb-chart-1': cssColor(chart[0]),
    '--tb-chart-2': cssColor(chart[1]),
    '--tb-chart-3': cssColor(chart[2]),
    '--tb-chart-4': cssColor(chart[3]),
    '--tb-skeleton': cssColor(bgTertiary),
    '--tb-skeleton-highlight': cssColor(shift(bgTertiary, dark ? 0.03 : 0.02, tint * 0.42, hue)),
    '--tb-syntax-property': cssColor(color(lightnessOf(link), 0.1, hueOf(link))),
    '--tb-shadow-popover': shadows,
    '--tb-shadow-modal': dark ? '0 18px 30px rgb(0 0 0 / 0.62)' : '0 18px 30px rgb(0 0 0 / 0.18)',
    '--tb-shadow-control': dark ? '0 1px 4px rgb(0 0 0 / 0.42)' : '0 1px 4px rgb(0 0 0 / 0.14)',
    '--tb-shadow-card': dark ? '0 2px 8px rgb(0 0 0 / 0.36)' : '0 2px 8px rgb(0 0 0 / 0.12)',
    '--tb-shadow-float': dark ? '0 24px 64px rgb(0 0 0 / 0.5)' : '0 24px 64px rgb(0 0 0 / 0.12)',
  };
}

function renderCss() {
  return `${PALETTES.map(
    (palette) =>
      `[data-theme='palette-${palette.name}'] {\n${Object.entries(build(palette))
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')}\n}`
  ).join('\n\n')}\n`;
}

function renderTs() {
  const rows = PALETTES.map(
    (palette) =>
      `  { value: 'palette-${palette.name}', title: '${palette.title}', mode: '${palette.mode}' },`
  ).join('\n');

  return `export const THEMES = [\n${rows}\n] as const;\n\nexport type GeneratedThemeName = (typeof THEMES)[number]['value'];\n`;
}

const css = renderCss();
const ts = renderTs();

if (process.argv.includes('--check')) {
  const stale = [
    [CSS_PATH, css],
    [TS_PATH, ts],
  ].filter(([file, content]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content);

  if (stale.length > 0) {
    console.error(
      `Расхождение в ${stale.map(([file]) => file).join(', ')} — запусти npm run gen:themes`
    );
    process.exit(1);
  }

  console.log('✓ темы совпадают с генератором');
} else {
  fs.writeFileSync(CSS_PATH, css);
  fs.writeFileSync(TS_PATH, ts);
  console.log(`✓ темы: ${PALETTES.map((palette) => `palette-${palette.name}`).join(', ')}`);
}
