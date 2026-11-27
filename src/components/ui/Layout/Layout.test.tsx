import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Grid, Stack } from './Layout';

describe('Stack', () => {
  it('renders direction, alignment and justify as data attributes', () => {
    render(
      <Stack direction="row" align="center" justify="between">
        <span>Первый</span>
        <span>Второй</span>
      </Stack>
    );

    const stack = screen.getByText('Первый').parentElement;
    expect(stack?.getAttribute('data-direction')).toBe('row');
    expect(stack?.getAttribute('data-align')).toBe('center');
    expect(stack?.getAttribute('data-justify')).toBe('between');
  });

  it('maps gap to a spacing token variable', () => {
    render(<Stack gap="6">Содержимое</Stack>);

    const stack = screen.getByText('Содержимое');
    expect(stack.style.getPropertyValue('--tb-stack-gap')).toBe('var(--tb-space-6)');
  });

  it('turns gap none into zero', () => {
    render(<Stack gap="none">Содержимое</Stack>);

    expect(screen.getByText('Содержимое').style.getPropertyValue('--tb-stack-gap')).toBe('0');
  });

  it('changes the rendered tag', () => {
    const { container } = render(
      <Stack as="ul">
        <li>Пункт</li>
      </Stack>
    );

    expect(screen.getByRole('list').tagName).toBe('UL');
    expect(container.querySelector('ul')).toBeTruthy();
  });
});

describe('Grid', () => {
  it('sets columns and gap as custom properties', () => {
    render(<Grid columns={3} gap="2">Содержимое</Grid>);

    const grid = screen.getByText('Содержимое');
    expect(grid.style.getPropertyValue('--tb-grid-columns')).toBe('3');
    expect(grid.style.getPropertyValue('--tb-grid-gap')).toBe('var(--tb-space-2)');
    expect(grid.hasAttribute('data-min-item-width')).toBe(false);
  });

  it('switches to auto-fill when minItemWidth is set', () => {
    render(<Grid minItemWidth="m">Содержимое</Grid>);

    expect(screen.getByText('Содержимое').getAttribute('data-min-item-width')).toBe('m');
  });

  it('renders all children', () => {
    render(
      <Grid columns={2}>
        <span>Первый</span>
        <span>Второй</span>
      </Grid>
    );

    expect(screen.getByText('Первый')).toBeTruthy();
    expect(screen.getByText('Второй')).toBeTruthy();
  });
});
