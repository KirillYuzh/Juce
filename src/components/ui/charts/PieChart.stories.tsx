import type { Meta, StoryObj } from '@storybook/react-vite';
import { PieChart } from './PieChart';
import type { ChartRow } from './chartUtils';

const meta: Meta = {
  title: 'Primitives/Charts/Pie',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const data: ChartRow[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
  { browser: 'Edge', visitors: 173 },
  { browser: 'Другие', visitors: 90 },
];

const frame = { width: 420 };

export const Pie: Story = {
  render: () => (
    <div style={frame}>
      <PieChart data={data} nameKey="browser" valueKey="visitors" innerRadius={0} legend />
    </div>
  ),
};

export const Donut: Story = {
  render: () => (
    <div style={frame}>
      <PieChart
        data={data}
        nameKey="browser"
        valueKey="visitors"
        centerValue="925"
        centerLabel="посетителей"
      />
    </div>
  ),
};

export const WithLegend: Story = {
  name: 'With legend',
  render: () => (
    <div style={{ width: 520, display: 'flex', alignItems: 'center', gap: 24 }}>
      <div style={{ width: 220 }}>
        <PieChart data={data} nameKey="browser" valueKey="visitors" height={220} />
      </div>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          margin: 0,
          padding: 0,
          listStyle: 'none',
          font: '400 13px/18px var(--tb-font-text)',
          color: 'var(--tb-text-secondary)',
        }}
      >
        {data.map((row) => (
          <li key={String(row.browser)} style={{ display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--tb-text-primary)', fontWeight: 500 }}>
              {String(row.browser)}
            </span>
            {String(row.visitors)}
          </li>
        ))}
      </ul>
    </div>
  ),
};
