import { describe, expect, it } from 'vitest';
import { INSET_RADIUS, radiusStyle } from './radius';

describe('radiusStyle', () => {
  it('passes the style through when no radius is given', () => {
    expect(radiusStyle(undefined, { color: 'red' })).toEqual({ color: 'red' });
  });

  it('maps every radius value to its token', () => {
    expect(radiusStyle('xxs')).toEqual({ '--tb-radius': 'var(--tb-radius-xxs)' });
    expect(radiusStyle('xs')).toEqual({ '--tb-radius': 'var(--tb-radius-xs)' });
    expect(radiusStyle('s', { color: 'red' })).toEqual({
      color: 'red',
      '--tb-radius': 'var(--tb-radius-s)',
    });
    expect(radiusStyle('m')).toEqual({ '--tb-radius': 'var(--tb-radius-m)' });
    expect(radiusStyle('l')).toEqual({ '--tb-radius': 'var(--tb-radius-l)' });
    expect(radiusStyle('pill')).toEqual({ '--tb-radius': 'var(--tb-radius-pill)' });
  });

  it('expands inset to parent radius minus parent padding, clamped at zero', () => {
    expect(radiusStyle('inset')).toEqual({ '--tb-radius': INSET_RADIUS });
    expect(INSET_RADIUS).toContain('max(0px, calc(');
    expect(INSET_RADIUS).toContain('var(--tb-radius-parent,');
    expect(INSET_RADIUS).toContain('var(--tb-radius-parent-padding, 0px)');
  });
});
