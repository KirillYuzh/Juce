import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { AreaChart } from './AreaChart';
import { LineChart } from './LineChart';
import { PieChart } from './PieChart';

const PLOT_WIDTH = 400;
const originalResizeObserver = globalThis.ResizeObserver;

class SizedResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    this.callback(
      [{ contentRect: { width: PLOT_WIDTH } } as ResizeObserverEntry],
      this as unknown as ResizeObserver
    );
  }

  unobserve() {}

  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver = SizedResizeObserver as unknown as typeof ResizeObserver;
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

const series = [{ key: 'value', label: 'Значение' }];
const rows = [
  { month: 'Январь', value: 1 },
  { month: 'Февраль', value: 2 },
  { month: 'Март', value: 3 },
];

describe('AreaChart', () => {
  it('переживает уменьшение данных после наведения и отдаёт таблицу', () => {
    const { container, rerender } = render(
      <AreaChart data={rows} series={series} xKey="month" height={240} />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    const marchMatches = screen.getAllByText('Март').length;
    fireEvent.pointerMove(svg as SVGSVGElement, { clientX: PLOT_WIDTH - 52, clientY: 10 });
    expect(screen.getAllByText('Март').length).toBe(marchMatches + 1);

    const table = container.querySelector('table.tb-visually-hidden');
    expect(table?.textContent).toContain('Март');
    expect(table?.textContent).toContain('Значение');

    rerender(<AreaChart data={rows.slice(0, 1)} series={series} xKey="month" height={240} />);

    expect(container.querySelector('table.tb-visually-hidden')?.textContent).toContain('Январь');
  });
});

describe('LineChart', () => {
  it('переживает уменьшение данных после наведения и отдаёт таблицу', () => {
    const { container, rerender } = render(
      <LineChart data={rows} series={series} xKey="month" height={240} dots />
    );
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();

    fireEvent.pointerMove(svg as SVGSVGElement, { clientX: PLOT_WIDTH - 52, clientY: 10 });

    expect(container.querySelector('table.tb-visually-hidden')?.textContent).toContain('Март');

    rerender(<LineChart data={rows.slice(0, 1)} series={series} xKey="month" height={240} dots />);

    expect(container.querySelector('table.tb-visually-hidden')?.textContent).toContain('Январь');
  });
});

describe('PieChart', () => {
  it('отдаёт доступную таблицу данных', () => {
    const { container } = render(
      <PieChart
        data={[
          { lang: 'Java', share: 60 },
          { lang: 'Go', share: 40 },
        ]}
        nameKey="lang"
        valueKey="share"
        height={240}
      />
    );

    const table = container.querySelector('table.tb-visually-hidden');
    expect(table?.textContent).toContain('Java');
    expect(table?.textContent).toContain('60');
  });
});
