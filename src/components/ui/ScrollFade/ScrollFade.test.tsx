import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ScrollFade, type ScrollFadeDirection } from './ScrollFade';

const cases: Array<[ScrollFadeDirection, string]> = [
  ['y', 'tb-scroll-fade-y'],
  ['x', 'tb-scroll-fade-x'],
  ['both', 'tb-scroll-fade'],
  ['top', 'tb-scroll-fade-t'],
  ['bottom', 'tb-scroll-fade-b'],
  ['left', 'tb-scroll-fade-l'],
  ['right', 'tb-scroll-fade-r'],
];

describe('ScrollFade', () => {
  it.each(cases)('maps %s to the %s class', (direction, className) => {
    render(<ScrollFade direction={direction}>Содержимое</ScrollFade>);

    const element = screen.getByText('Содержимое');
    expect(element.classList.contains(className)).toBe(true);
    expect(element.classList).toHaveLength(1);
  });

  it('uses the vertical class by default', () => {
    render(<ScrollFade>Содержимое</ScrollFade>);

    expect(screen.getByText('Содержимое').classList.contains('tb-scroll-fade-y')).toBe(true);
  });

  it('changes the rendered tag', () => {
    render(<ScrollFade as="section">Содержимое</ScrollFade>);

    expect(screen.getByText('Содержимое').tagName).toBe('SECTION');
  });

  it('renders children', () => {
    render(
      <ScrollFade>
        <span>Первый</span>
        <span>Второй</span>
      </ScrollFade>
    );

    expect(screen.getByText('Первый')).toBeTruthy();
    expect(screen.getByText('Второй')).toBeTruthy();
  });
});
