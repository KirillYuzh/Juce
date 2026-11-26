import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  chromaOf,
  compositeOver,
  contrastRatio,
  declarations,
  parseTokens,
  resolveColor,
  themeTokens,
  WHITE,
  type Rgb,
  type Rule,
} from '../../scripts/theme-color.mjs';
import { THEMES } from './themes';

const SOURCES = [
  'src/styles/structure.css',
  'src/styles/tokens.css',
  'src/styles/themes-presets.css',
];

const rules: Rule[] = SOURCES.flatMap((file) => parseTokens(fs.readFileSync(file, 'utf8')));

const SURFACES = ['--tb-bg', '--tb-surface', '--tb-bg-secondary'];

const PAIRS: Array<[text: string, surfaces: string[], minimum: number]> = [
  ['--tb-text-primary', SURFACES, 4.5],
  ['--tb-text-secondary', SURFACES, 4.5],
  ['--tb-text-muted', SURFACES, 4.5],
  ['--tb-text-link', SURFACES, 4.5],
  ['--tb-text-tertiary', SURFACES, 4.5],
  ['--tb-success-text', ['--tb-bg-secondary'], 4.5],
  ['--tb-error-text', ['--tb-bg-secondary'], 4.5],
  ['--tb-warning-text', ['--tb-bg-secondary'], 4.5],
  ['--tb-on-primary', ['--tb-primary', '--tb-primary-hover', '--tb-primary-active'], 4.5],
  ['--tb-on-accent', ['--tb-accent'], 4.5],
  ['--tb-on-error', ['--tb-error'], 4.5],
  ['--tb-border-control', ['--tb-bg', '--tb-surface', '--tb-field', '--tb-bg-secondary'], 3],
];

const ACCENTS = [
  '--tb-primary',
  '--tb-primary-hover',
  '--tb-primary-active',
  '--tb-on-primary',
  '--tb-accent',
  '--tb-accent-hover',
  '--tb-accent-soft',
  '--tb-accent-text',
  '--tb-accent-text-hover',
  '--tb-accent-on-inverse',
  '--tb-on-accent',
  '--link',
  '--link-hover',
  '--tb-border-on-primary',
  '--tb-rb-horizon',
  '--tb-rb-wave',
  '--tb-rb-crest',
];

const NEUTRALS = [
  '--tb-bg',
  '--tb-surface',
  '--tb-bg-secondary',
  '--tb-bg-tertiary',
  '--tb-bg-hover',
  '--tb-field',
  '--tb-field-hover',
  '--tb-option-hover',
  '--tb-option-selected',
  '--tb-text-primary',
  '--tb-text-secondary',
  '--tb-text-tertiary',
  '--tb-text-muted',
  '--tb-text-inverse',
  '--tb-text-inverse-secondary',
  '--tb-text-inverse-tertiary',
  '--tb-text-inverse-link',
  '--tb-secondary',
  '--tb-secondary-hover',
  '--tb-secondary-soft',
  '--tb-white',
  '--tb-black',
  '--tb-dark',
  '--tb-dark-soft',
  '--tb-gray-100',
  '--tb-gray-150',
  '--tb-gray-200',
  '--tb-gray-250',
  '--tb-gray-300',
  '--tb-gray-400',
  '--tb-gray-500',
  '--tb-gray-600',
  '--tb-border',
  '--tb-border-strong',
  '--tb-border-control',
  '--tb-border-inverse',
  '--tb-overlay',
  '--tb-skeleton',
  '--tb-skeleton-highlight',
];

const SHADOW = /^--tb-shadow-/;
const ACHROMATIC = 0.002;

const selectorParts = (rule: Rule): string[] => rule.selector.split(',').map((part) => part.trim());

const themes = [
  ...new Set(
    rules.flatMap((rule) =>
      [...rule.selector.matchAll(/\[data-theme='([a-z0-9-]+)'\]/g)].map((match) => match[1])
    )
  ),
];

const structuralRules = rules.filter((rule) =>
  selectorParts(rule).some((part) => part === '[data-theme]')
);

const structural = new Set(structuralRules.flatMap((rule) => [...declarations(rule.body).keys()]));

function colorRoles(tokens: Map<string, string>): string[] {
  return [...tokens.keys()].filter(
    (name) => name.startsWith('--tb-') && !structural.has(name) && !SHADOW.test(name)
  );
}

function colorFor(tokens: Map<string, string>, name: string, mode: 'light' | 'dark'): Rgb | null {
  const value = tokens.get(name);
  return value === undefined ? null : resolveColor(tokens, value, new Set(), mode);
}

describe('контраст токенов', () => {
  it('список тем в themes.ts совпадает с блоками CSS', () => {
    expect([...themes].sort()).toEqual(THEMES.map((theme) => theme.value).sort());
  });

  it('каждая тема разрешает все цветовые роли', () => {
    const failures: string[] = [];

    for (const theme of THEMES) {
      const tokens = themeTokens(rules, theme.value);

      for (const name of colorRoles(tokens)) {
        if (colorFor(tokens, name, theme.mode) === null) {
          failures.push(`${theme.value}: ${name} = ${tokens.get(name) ?? 'нет'}`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('тема меняет только акцентные роли, нейтрали общие', () => {
    const failures: string[] = [];

    for (const theme of THEMES) {
      for (const rule of rules) {
        if (!selectorParts(rule).includes(`[data-theme='${theme.value}']`)) continue;

        for (const name of declarations(rule.body).keys()) {
          if (!ACCENTS.includes(name)) failures.push(`${theme.value}: переопределяет ${name}`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('нейтральные роли ахроматичны во всех темах', () => {
    const failures: string[] = [];

    for (const theme of THEMES) {
      const tokens = themeTokens(rules, theme.value);

      for (const name of NEUTRALS) {
        const color = colorFor(tokens, name, theme.mode);
        if (!color) {
          failures.push(`${theme.value}: ${name} не разобрать (${tokens.get(name) ?? 'нет'})`);
          continue;
        }

        const chroma = chromaOf(compositeOver(color, WHITE));
        if (chroma > ACHROMATIC) {
          failures.push(`${theme.value}: ${name} с оттенком — chroma ${chroma.toFixed(4)}`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('каждый цветовой пресет объявляет тройку для фонов', () => {
    const presets = ['ocean', 'dune', 'dusk', 'silk', 'aurora'];
    const failures: string[] = [];

    for (const theme of presets) {
      const tokens = themeTokens(rules, theme);
      for (const name of ['--tb-rb-horizon', '--tb-rb-wave', '--tb-rb-crest']) {
        if (resolveColor(tokens, tokens.get(name) ?? '', new Set(), 'dark') === null) {
          failures.push(`${theme}: ${name} не задан`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('пары текст-поверхность держат порог WCAG AA', () => {
    const failures: string[] = [];

    for (const theme of THEMES) {
      const tokens = themeTokens(rules, theme.value);

      for (const [textToken, surfaces, minimum] of PAIRS) {
        for (const surfaceToken of surfaces) {
          const text = colorFor(tokens, textToken, theme.mode);
          const surface = colorFor(tokens, surfaceToken, theme.mode);

          if (!text || !surface) {
            failures.push(
              `${theme.value}: не удалось разобрать ${textToken} на ${surfaceToken} ` +
                `(${textToken}=${tokens.get(textToken) ?? 'нет'}, ${surfaceToken}=${tokens.get(surfaceToken) ?? 'нет'})`
            );
            continue;
          }

          const backdrop = compositeOver(surface, WHITE);
          const ratio = contrastRatio(compositeOver(text, backdrop), backdrop);

          if (ratio < minimum) {
            failures.push(
              `${theme.value}: ${textToken} на ${surfaceToken} — ${ratio.toFixed(2)}, нужно ${minimum}`
            );
          }
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('структурный блок объявляет радиусы и оставляет круглые роли', () => {
    expect(structuralRules.length, 'в structure.css нет блока [data-theme]').toBeGreaterThan(0);

    const values = new Map(
      structuralRules.flatMap((rule) => [...declarations(rule.body).entries()])
    );

    for (const name of [
      '--tb-radius-xxs',
      '--tb-radius-xs',
      '--tb-radius-s',
      '--tb-radius-m',
      '--tb-radius-l',
      '--tb-radius-control',
      '--tb-radius-surface',
      '--tb-radius-popover',
      '--tb-radius-chip',
      '--tb-radius-switch',
      '--tb-radius-avatar',
      '--tb-focus-ring',
      '--tb-font-heading',
      '--tb-font-text',
      '--tb-font-mono',
      '--tb-duration-ambient',
    ]) {
      expect(values.has(name), `в structure.css нет ${name}`).toBe(true);
    }

    expect(values.get('--tb-radius-pill')).toBe('999px');
    expect(values.get('--tb-radius-circle')).toBe('50%');
  });

  it('accent-text читается на accent-soft во всех темах', () => {
    const failures: string[] = [];

    for (const theme of THEMES) {
      const tokens = themeTokens(rules, theme.value);
      const text = colorFor(tokens, '--tb-accent-text', theme.mode);
      const soft = colorFor(tokens, '--tb-accent-soft', theme.mode);
      if (!text || !soft) {
        failures.push(`${theme.value}: не разобрать accent-text/accent-soft`);
        continue;
      }

      for (const surfaceName of SURFACES) {
        const surface = colorFor(tokens, surfaceName, theme.mode);
        if (!surface) continue;
        const backdrop = compositeOver(soft, surface);
        const ratio = contrastRatio(compositeOver(text, backdrop), backdrop);
        if (ratio < 4.5) {
          failures.push(
            `${theme.value}: accent-text на accent-soft поверх ${surfaceName} — ${ratio.toFixed(2)}`
          );
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('prefers-contrast объявлен после базовых токенов', () => {
    const structure = fs.readFileSync('src/styles/structure.css', 'utf8');
    const tokens = fs.readFileSync('src/styles/tokens.css', 'utf8');
    const index = fs.readFileSync('src/styles/index.css', 'utf8');

    expect(structure).not.toContain('prefers-contrast');
    const block = tokens.indexOf('@media (prefers-contrast');
    expect(block).toBeGreaterThan(-1);
    expect(block).toBeGreaterThan(tokens.indexOf('--tb-text-secondary:'));
    expect(block).toBeGreaterThan(tokens.indexOf('--tb-border-control:'));
    expect(index.indexOf('./tokens.css')).toBeGreaterThan(index.indexOf('./structure.css'));
  });
});
