import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
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

const SOURCES = ['src/styles/themes.css', 'src/styles/skins.css', 'src/styles/tokens.css'];

const rules: Rule[] = SOURCES.flatMap((file) => parseTokens(fs.readFileSync(file, 'utf8')));

const SURFACES = ['--tb-bg', '--tb-surface', '--tb-bg-secondary'];

const PAIRS: Array<[text: string, surfaces: string[], minimum: number]> = [
  ['--tb-text-primary', SURFACES, 4.5],
  ['--tb-text-secondary', SURFACES, 4.5],
  ['--tb-text-muted', SURFACES, 4.5],
  ['--tb-text-link', SURFACES, 4.5],
  ['--tb-text-tertiary', SURFACES, 3],
  ['--tb-on-primary', ['--tb-primary'], 4.5],
  ['--tb-on-accent', ['--tb-accent'], 4.5],
  ['--tb-border-control', ['--tb-bg', '--tb-surface', '--tb-field'], 3],
];

const selectorParts = (rule: Rule): string[] => rule.selector.split(',').map((part) => part.trim());

const themes = [
  ...new Set(
    rules.flatMap((rule) =>
      [...rule.selector.matchAll(/\[data-theme='([a-z0-9-]+)'\]/g)].map((match) => match[1])
    )
  ),
];

const structuralRules = rules.filter((rule) =>
  selectorParts(rule).some((part) => part === '[data-theme]' || part === '[data-skin]')
);

const structural = new Set(
  structuralRules.flatMap((rule) => [...declarations(rule.body).keys()])
);

function declaredBy(theme: string): Set<string> {
  const names = new Set<string>();
  for (const rule of rules) {
    if (!selectorParts(rule).includes(`[data-theme='${theme}']`)) continue;
    for (const name of declarations(rule.body).keys()) names.add(name);
  }
  return names;
}

const colorNames = [...declaredBy('light')].filter(
  (name) => name.startsWith('--tb-') && !structural.has(name)
);

function colorFor(tokens: Map<string, string>, name: string): Rgb | null {
  const value = tokens.get(name);
  return value === undefined ? null : resolveColor(tokens, value);
}

describe('контраст токенов', () => {
  it('находит обе оси: названные темы и скин', () => {
    expect(themes, `найдены темы: ${themes.join(', ')}`).toEqual(
      expect.arrayContaining(['light', 'dark', 'palette-wasabi', 'palette-wasabi-dark'])
    );
    expect(
      rules.some((rule) => selectorParts(rule).includes("[data-skin='blueprint']")),
      'в skins.css нет блока [data-skin=blueprint]'
    ).toBe(true);
  });

  it('каждая цветовая тема объявляет те же роли, что light', () => {
    const missing: string[] = [];

    for (const theme of themes) {
      const own = declaredBy(theme);
      for (const name of colorNames) {
        if (!own.has(name)) missing.push(`${theme} не объявляет ${name}`);
      }
    }

    expect(missing, missing.join('\n')).toEqual([]);
  });

  it('пары текст-поверхность держат порог WCAG AA', () => {
    const failures: string[] = [];

    for (const theme of themes) {
      const tokens = themeTokens(rules, theme);

      for (const [textToken, surfaces, minimum] of PAIRS) {
        for (const surfaceToken of surfaces) {
          const text = colorFor(tokens, textToken);
          const surface = colorFor(tokens, surfaceToken);

          if (!text || !surface) {
            failures.push(
              `${theme}: не удалось разобрать ${textToken} на ${surfaceToken} ` +
                `(${textToken}=${tokens.get(textToken) ?? 'нет'}, ${surfaceToken}=${tokens.get(surfaceToken) ?? 'нет'})`
            );
            continue;
          }

          const backdrop = compositeOver(surface, WHITE);
          const ratio = contrastRatio(compositeOver(text, backdrop), backdrop);

          if (ratio < minimum) {
            failures.push(
              `${theme}: ${textToken} на ${surfaceToken} — ${ratio.toFixed(2)}, нужно ${minimum}`
            );
          }
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  it('скин blueprint делает контролы квадратными и сохраняет круглые формы', () => {
    const blueprintRule = rules.find((rule) =>
      selectorParts(rule).includes("[data-skin='blueprint']")
    );

    expect(blueprintRule, 'в skins.css нет блока [data-skin=blueprint]').toBeDefined();

    const blueprint = declarations(blueprintRule?.body ?? '');
    const square = [
      '--tb-radius-xxs',
      '--tb-radius-xs',
      '--tb-radius-s',
      '--tb-radius-m',
      '--tb-radius-l',
      '--tb-radius-control',
      '--tb-radius-surface',
      '--tb-radius-popover',
    ];

    for (const name of square) {
      expect(
        blueprint.get(name),
        `blueprint: ${name} должно быть 0px, сейчас ${blueprint.get(name) ?? 'не задано'}`
      ).toBe('0px');
    }

    expect(
      blueprint.has('--tb-radius-pill'),
      'blueprint не должен переопределять --tb-radius-pill'
    ).toBe(false);
    expect(
      blueprint.has('--tb-radius-circle'),
      'blueprint не должен переопределять --tb-radius-circle'
    ).toBe(false);

    const structuralValues = new Map(
      structuralRules.flatMap((rule) => [...declarations(rule.body).entries()])
    );
    expect(structuralValues.get('--tb-radius-pill')).toBe('999px');
    expect(structuralValues.get('--tb-radius-circle')).toBe('50%');
  });
});
