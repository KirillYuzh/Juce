import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PieChart } from './PieChart';
import { stubPlotWidth } from './chartTestUtils';

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
});
