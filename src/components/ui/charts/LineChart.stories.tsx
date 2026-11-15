import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './LineChart';
import type { ChartRow } from './chartUtils';

const meta: Meta = {
  title: 'Primitives/Charts/Line',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const data: ChartRow[] = [
  { month: 'Январь', desktop: 186, mobile: 80 },
  { month: 'Февраль', desktop: 305, mobile: 200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: 273, mobile: 190 },
  { month: 'Май', desktop: 209, mobile: 130 },
  { month: 'Июнь', desktop: 214, mobile: 140 },
];

const frame = { width: 560 };
const series = [
  { key: 'desktop', label: 'Десктоп' },
  { key: 'mobile', label: 'Мобильные' },
];

export const Line: Story = {
  render: () => (
    <div style={frame}>
      <LineChart data={data} xKey="month" series={series} dots legend />
    </div>
  ),
};

export const Linear: Story = {
  render: () => (
    <div style={frame}>
      <LineChart data={data} xKey="month" series={series} curve="linear" />
    </div>
  ),
};

export const Step: Story = {
  render: () => (
    <div style={frame}>
      <LineChart
        data={data}
        xKey="month"
        series={[{ key: 'desktop', label: 'Десктоп' }]}
        curve="step"
      />
    </div>
  ),
};

export const SingleLine: Story = {
  name: 'Single line',
  render: () => (
    <div style={frame}>
      <LineChart
        data={data}
        xKey="month"
        series={[{ key: 'desktop', label: 'Десктоп' }]}
        height={200}
      />
    </div>
  ),
};
