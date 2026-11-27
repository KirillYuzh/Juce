import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LineChart } from './LineChart';
import { stubPlotWidth } from './chartTestUtils';

const series = [{ key: 'a', label: 'A' }];

const rows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ x: `p${index}`, a: index + 1 }));

const longRows = Array.from({ length: 6 }, (_, index) => ({
  x: `Неделя ${index + 1}, январь 2025 г.`,
  a: index + 1,
}));

const xLabels = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('text')).filter((node) => node.getAttribute('y') === '234');

const fixed = [
  { x: 'a', v: 0 },
  { x: 'b', v: 50 },
  { x: 'c', v: 100 },
];

const negative = [
  { x: 'p0', a: -40 },
  { x: 'p1', a: 20 },
  { x: 'p2', a: -10 },
];

const hasNaN = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('path, circle')).some((node) =>
    ['d', 'cx', 'cy'].some((name) => (node.getAttribute(name) ?? '').includes('NaN'))
  );

const dataTable = (container: HTMLElement) => {
  const table = container.querySelector('table');
  if (!(table instanceof HTMLTableElement)) throw new Error('chart data table is missing');
  return table;
};

const tableGrid = (table: HTMLTableElement) => ({
  head: Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent),
  rows: Array.from(table.querySelectorAll('tbody tr')).map((row) =>
    Array.from(row.querySelectorAll('th, td')).map((cell) => cell.textContent)
  ),
});

const nonNegativePath = [
  'M44,216',
  'C73,198.66666666666666 160,146.66666666666666 218,112',
  'C276,77.33333333333334 363,25.333333333333332 392,8',
].join('');

describe('LineChart', () => {
  it('renders a long series without spreading it into arguments', () => {
    const data = Array.from({ length: 200_000 }, (_, index) => ({ x: index, a: index }));
    expect(() => render(<LineChart data={data} series={series} xKey="x" />)).not.toThrow();
  });

  it('keeps the path for non-negative data exactly as before', () => {
    stubPlotWidth(400);
    const { container } = render(
      <LineChart data={fixed} series={[{ key: 'v', label: 'V' }]} xKey="x" />
    );

    expect(container.querySelector('path')?.getAttribute('d')).toBe(nonNegativePath);
  });

  it('keeps negative points inside the plot', () => {
    stubPlotWidth(400);
    const { container } = render(<LineChart data={negative} series={series} xKey="x" dots />);
    const dots = Array.from(container.querySelectorAll('circle'));

    expect(dots).toHaveLength(negative.length);
    for (const dot of dots) {
      const cy = Number(dot.getAttribute('cy'));
      expect(cy).toBeGreaterThanOrEqual(8);
      expect(cy).toBeLessThanOrEqual(240 - 24);
    }

    expect(hasNaN(container)).toBe(false);
  });

  it('labels the axis with negative ticks', () => {
    stubPlotWidth(400);
    const { container } = render(<LineChart data={negative} series={series} xKey="x" />);
    const labels = Array.from(container.querySelectorAll('text')).map((node) => node.textContent);

    expect(labels).toContain('-40');
    expect(labels).toContain('20');
  });

  it('survives the data shrinking under the pointer', () => {
    stubPlotWidth(400);
    const { rerender } = render(<LineChart data={rows(3)} series={series} xKey="x" />);
    fireEvent.pointerMove(screen.getByRole('img'), { clientX: 400 });

    expect(() => rerender(<LineChart data={rows(1)} series={series} xKey="x" />)).not.toThrow();
  });

  it('drops the hovered point when the data shrinks and grows again', () => {
    stubPlotWidth(400);
    const { container, rerender } = render(<LineChart data={rows(3)} series={series} xKey="x" />);
    fireEvent.pointerMove(screen.getByRole('img'), { clientX: 400 });
    expect(container.querySelectorAll('circle')).toHaveLength(1);

    rerender(<LineChart data={rows(1)} series={series} xKey="x" />);
    rerender(<LineChart data={rows(3)} series={series} xKey="x" />);

    expect(container.querySelectorAll('circle')).toHaveLength(0);
  });

  it('renders series with duplicate labels without duplicate React keys', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(
      <LineChart
        data={rows(2)}
        series={[
          { key: 'a', label: 'Одно имя' },
          { key: 'b', label: 'Одно имя' },
        ]}
        xKey="x"
        legend
      />
    );
    const messages = error.mock.calls.map((call) => call.join(' ')).join('\n');
    error.mockRestore();

    expect(messages).not.toMatch(/same key/i);
  });

  it('drops long x labels that do not fit the plot', () => {
    stubPlotWidth(400);
    const { container } = render(<LineChart data={longRows} series={series} xKey="x" />);
    const rendered = xLabels(container);

    expect(rendered.length).toBeGreaterThan(0);
    expect(rendered.length).toBeLessThan(longRows.length);
  });

  it('keeps short x labels spaced as before', () => {
    stubPlotWidth(400);
    const { container } = render(<LineChart data={rows(6)} series={series} xKey="x" />);

    expect(xLabels(container)).toHaveLength(4);
  });

  it('exposes the data as a caption table for screen readers', () => {
    stubPlotWidth(400);
    const { container } = render(
      <LineChart
        data={[
          { x: 'p0', a: 1, b: 10 },
          { x: 'p1', a: 2, b: 20 },
          { x: 'p2', a: 3, b: 30 },
        ]}
        series={[
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
        ]}
        xKey="x"
        valueFormat={(value) => `${value.toFixed(1)} кг`}
      />
    );
    const table = dataTable(container);
    const { head, rows: body } = tableGrid(table);

    expect(table.querySelector('caption')?.textContent).toBe('График: A, B');
    expect(head).toEqual(['x', 'A', 'B']);
    expect(body).toEqual([
      ['p0', '1.0 кг', '10.0 кг'],
      ['p1', '2.0 кг', '20.0 кг'],
      ['p2', '3.0 кг', '30.0 кг'],
    ]);
  });
});
