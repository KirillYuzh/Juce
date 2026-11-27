import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PieChart } from './PieChart';
import { stubPlotWidth } from './chartTestUtils';

const paths = (container: HTMLElement) => Array.from(container.querySelectorAll('path'));

describe('PieChart', () => {
  it('draws a lone 100% slice as a full circle', () => {
    stubPlotWidth(240);
    const { container } = render(
      <PieChart
        data={[{ name: 'Всё', value: 100 }]}
        nameKey="name"
        valueKey="value"
        innerRadius={0}
      />
    );
    const d = container.querySelector('path')?.getAttribute('d') ?? '';

    expect(d.match(/A/g)).toHaveLength(2);
  });

  it('draws no slices and no NaN for empty data', () => {
    stubPlotWidth(240);
    const { container } = render(<PieChart data={[]} nameKey="name" valueKey="value" />);

    expect(paths(container)).toHaveLength(0);
  });

  it('draws nothing when the total is zero', () => {
    stubPlotWidth(240);
    const { container } = render(
      <PieChart
        data={[
          { name: 'a', value: 0 },
          { name: 'b', value: 0 },
        ]}
        nameKey="name"
        valueKey="value"
      />
    );

    expect(paths(container)).toHaveLength(0);
    for (const path of paths(container)) expect(path.getAttribute('d')).not.toContain('NaN');
  });

  it('ignores negative values and draws only the positive part', () => {
    stubPlotWidth(240);
    const { container } = render(
      <PieChart
        data={[
          { name: 'a', value: 5 },
          { name: 'b', value: -5 },
        ]}
        nameKey="name"
        valueKey="value"
        innerRadius={0}
        legend
      />
    );
    const drawn = paths(container);

    expect(drawn).toHaveLength(1);
    for (const path of drawn) {
      const d = path.getAttribute('d') ?? '';
      expect(d).not.toContain('NaN');
      expect(d.match(/A/g)).toHaveLength(2);
    }
    expect(container.textContent).toContain('b');
  });
});
