import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BarChart } from './BarChart';
import { stubPlotWidth } from './chartTestUtils';

const dataTable = (container: HTMLElement) => {
  const table = container.querySelector('table');
  if (!(table instanceof HTMLTableElement)) throw new Error('chart data table is missing');
  return table;
};

describe('BarChart', () => {
  it('exposes the data as a caption table for screen readers', () => {
    stubPlotWidth(400);
    const { container } = render(
      <BarChart
        data={[
          { x: 'p0', a: 1, b: 10 },
          { x: 'p1', a: 2, b: 20 },
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
    const head = Array.from(table.querySelectorAll('thead th')).map((cell) => cell.textContent);
    const body = Array.from(table.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('th, td')).map((cell) => cell.textContent)
    );

    expect(table.querySelector('caption')?.textContent).toBe('График: A, B');
    expect(head).toEqual(['x', 'A', 'B']);
    expect(body).toEqual([
      ['p0', '1.0 кг', '10.0 кг'],
      ['p1', '2.0 кг', '20.0 кг'],
    ]);
  });
});
