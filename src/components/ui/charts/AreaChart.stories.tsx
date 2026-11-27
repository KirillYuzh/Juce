import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart } from './AreaChart';
import type { ChartRow } from './chartUtils';

const meta: Meta = {
  title: 'Primitives/Charts/Area',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const oneSeries: ChartRow[] = [
  { month: 'Январь', visitors: 186 },
  { month: 'Февраль', visitors: 305 },
  { month: 'Март', visitors: 237 },
  { month: 'Апрель', visitors: 373 },
  { month: 'Май', visitors: 309 },
  { month: 'Июнь', visitors: 414 },
];

const twoSeries: ChartRow[] = [
  { month: 'Январь', desktop: 186, mobile: 80 },
  { month: 'Февраль', desktop: 305, mobile: 200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: 373, mobile: 190 },
  { month: 'Май', desktop: 209, mobile: 130 },
  { month: 'Июнь', desktop: 374, mobile: 140 },
];

const mixed: ChartRow[] = [
  { month: 'Январь', desktop: 186, mobile: -80 },
  { month: 'Февраль', desktop: -120, mobile: 200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: 173, mobile: -190 },
  { month: 'Май', desktop: -209, mobile: 130 },
  { month: 'Июнь', desktop: 214, mobile: 140 },
];

const frame = { width: 560 };

const longLabels: ChartRow[] = Array.from({ length: 8 }, (_, index) => ({
  week: `Неделя ${index + 1}, январь 2025 г.`,
  visitors: 120 + index * 40,
}));

export const Area: Story = {
  render: () => (
    <div style={frame}>
      <AreaChart
        data={oneSeries}
        xKey="month"
        series={[{ key: 'visitors', label: 'Посетители' }]}
      />
    </div>
  ),
};

export const TwoSeries: Story = {
  name: 'Two series',
  render: () => (
    <div style={frame}>
      <AreaChart
        data={twoSeries}
        xKey="month"
        series={[
          { key: 'desktop', label: 'Десктоп' },
          { key: 'mobile', label: 'Мобильные' },
        ]}
        legend
      />
    </div>
  ),
};

export const Linear: Story = {
  render: () => (
    <div style={frame}>
      <AreaChart
        data={twoSeries}
        xKey="month"
        series={[
          { key: 'desktop', label: 'Десктоп' },
          { key: 'mobile', label: 'Мобильные' },
        ]}
        curve="linear"
      />
    </div>
  ),
};

export const Step: Story = {
  render: () => (
    <div style={frame}>
      <AreaChart
        data={oneSeries}
        xKey="month"
        series={[{ key: 'visitors', label: 'Посетители' }]}
        curve="step"
      />
    </div>
  ),
};

export const Stacked: Story = {
  render: () => (
    <div style={frame}>
      <AreaChart
        data={twoSeries}
        xKey="month"
        series={[
          { key: 'desktop', label: 'Десктоп' },
          { key: 'mobile', label: 'Мобильные' },
        ]}
        stacked
        legend
      />
    </div>
  ),
};

export const Negatives: Story = {
  render: () => (
    <div style={frame}>
      <AreaChart
        data={mixed}
        xKey="month"
        series={[
          { key: 'desktop', label: 'Десктоп' },
          { key: 'mobile', label: 'Мобильные' },
        ]}
        legend
      />
    </div>
  ),
};

export const WithoutGrid: Story = {
  name: 'Without grid',
  render: () => (
    <div style={frame}>
      <AreaChart
        data={oneSeries}
        xKey="month"
        series={[{ key: 'visitors', label: 'Посетители' }]}
        grid={false}
        fill="none"
        height={160}
      />
    </div>
  ),
};

export const LongLabels: Story = {
  name: 'Long labels',
  render: () => (
    <div style={frame}>
      <AreaChart
        data={longLabels}
        xKey="week"
        series={[{ key: 'visitors', label: 'Посетители' }]}
        legend
      />
    </div>
  ),
};
