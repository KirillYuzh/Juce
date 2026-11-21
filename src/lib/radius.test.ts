import { describe, expect, it } from 'vitest';
import { INSET_RADIUS, radiusStyle } from './radius';

describe('radiusStyle', () => {
  it('passes the style through when no radius is given', () => {
    expect(radiusStyle(undefined, { color: 'red' })).toEqual({ color: 'red' });
  });

  it('turns numbers into pixels and keeps strings', () => {
    expect(radiusStyle(12)).toEqual({ '--tb-radius': '12px' });
    expect(radiusStyle('var(--tb-radius-l)')).toEqual({ '--tb-radius': 'var(--tb-radius-l)' });
  });

  it('expands inset to parent radius minus parent padding', () => {
    expect(radiusStyle('inset')).toEqual({ '--tb-radius': INSET_RADIUS });
    expect(INSET_RADIUS).toContain('var(--tb-radius-parent,');
    expect(INSET_RADIUS).toContain('var(--tb-radius-parent-padding, 0px)');
  });
});
