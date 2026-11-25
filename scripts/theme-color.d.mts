export type Rgb = { mode: 'rgb'; r: number; g: number; b: number; alpha: number };
export type Tokens = Map<string, string>;
export type Rule = { selector: string; body: string };
export type AnyColor = Record<string, unknown>;

export const WHITE: Rgb;

export function oklch(value: unknown): { l: number; c?: number; h?: number };
export function hueOf(value: unknown): number;
export function lightnessOf(value: unknown): number;
export function chromaOf(value: unknown): number;
export function clamp(value: number): number;

export function parseTokens(css: string): Rule[];
export function declarations(body: string): Map<string, string>;
export function themeTokens(rules: Rule[], theme: string): Tokens;
export function declaredTheme(rules: Rule[], theme: string): Set<string>;
export function resolveColor(tokens: Tokens, value: string, seen?: Set<string>): Rgb | null;

export function luminance(value: AnyColor): number;
export function contrastRatio(first: AnyColor, second: AnyColor): number;
export function compositeOver(foreground: Rgb, background: Rgb): Rgb;

export function inGamut(value: AnyColor): boolean;
export function clampToGamut(value: AnyColor): AnyColor;
export function cssColor(value: AnyColor): string;
export function shift(value: AnyColor, delta: number, chroma?: number, hue?: number): AnyColor;
export function closestPassing(
  backdrops: AnyColor[],
  hue: number,
  chroma: number,
  target: number
): AnyColor;
export function ensureContrast(fill: AnyColor, text: AnyColor, target: number): AnyColor;
export function bestText(backdrop: AnyColor, light: AnyColor, dark: AnyColor): AnyColor;
export function keepContrast(fill: AnyColor, text: AnyColor, delta: number): AnyColor;
