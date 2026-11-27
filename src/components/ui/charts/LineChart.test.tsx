import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LineChart } from './LineChart';
import { stubPlotWidth } from './chartTestUtils';

const series = [{ key: 'a', label: 'A' }];

const rows = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ x: `p${index}`, a: index + 1 }));

describe('LineChart', () => {
  it('renders a long series without spreading it into arguments', () => {
    const data = Array.from({ length: 200_000 }, (_, index) => ({ x: index, a: index }));
    expect(() => render(<LineChart data={data} series={series} xKey="x" />)).not.toThrow();
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
});
