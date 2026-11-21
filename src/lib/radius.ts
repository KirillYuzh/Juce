import type { CSSProperties } from 'react';

export type RadiusValue = 'inset' | number | string;

export const INSET_RADIUS =
  'calc(var(--tb-radius-parent, var(--tb-radius-fallback, var(--tb-radius-m))) - var(--tb-radius-parent-padding, 0px))';

export function radiusStyle(
  radius: RadiusValue | undefined,
  style?: CSSProperties
): CSSProperties | undefined {
  if (radius === undefined) return style;
  const value =
    radius === 'inset' ? INSET_RADIUS : typeof radius === 'number' ? `${radius}px` : radius;
  return { ...style, '--tb-radius': value } as CSSProperties;
}
