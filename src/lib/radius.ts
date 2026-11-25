import type { CSSProperties } from 'react';

export type RadiusValue = 'inset' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'pill';

const RADIUS_TOKEN: Record<Exclude<RadiusValue, 'inset'>, string> = {
  xxs: 'var(--tb-radius-xxs)',
  xs: 'var(--tb-radius-xs)',
  s: 'var(--tb-radius-s)',
  m: 'var(--tb-radius-m)',
  l: 'var(--tb-radius-l)',
  pill: 'var(--tb-radius-pill)',
};

export const INSET_RADIUS =
  'max(0px, calc(var(--tb-radius-parent, var(--tb-radius-fallback, var(--tb-radius-m))) - var(--tb-radius-parent-padding, 0px)))';

export function radiusStyle(
  radius: RadiusValue | undefined,
  style?: CSSProperties
): CSSProperties | undefined {
  if (radius === undefined) return style;
  const value = radius === 'inset' ? INSET_RADIUS : RADIUS_TOKEN[radius];
  return { ...style, '--tb-radius': value } as CSSProperties;
}
