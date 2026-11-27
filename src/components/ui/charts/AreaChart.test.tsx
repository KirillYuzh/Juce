import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AreaChart } from './AreaChart';
import { stubPlotWidth } from './chartTestUtils';

const series = [{ key: 'a', label: 'A' }];

const rows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ x: `p${index}`, a: index + 1 }));

describe('AreaChart', () => {
  it('renders a long series without spreading it into arguments', () => {
    const data = Array.from({ length: 200_000 }, (_, index) => ({ x: index, a: index }));
    expect(() => render(<AreaChart data={data} series={series} xKey="x" />)).not.toThrow();
  });

  it('renders no path for empty data', () => {
    stubPlotWidth(400);
    const { container } = render(<AreaChart data={[]} series={series} xKey="x" />);

    expect(container.querySelectorAll('path')).toHaveLength(0);
  });

  it('survives the data shrinking under the pointer', () => {
    stubPlotWidth(400);
    const { rerender } = render(<AreaChart data={rows(3)} series={series} xKey="x" />);
    fireEvent.pointerMove(screen.getByRole('img'), { clientX: 400 });

    expect(() => rerender(<AreaChart data={rows(1)} series={series} xKey="x" />)).not.toThrow();
  });
});
