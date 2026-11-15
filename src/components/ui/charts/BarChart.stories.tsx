import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';
import type { ChartRow } from './chartUtils';

const meta: Meta = {
  title: 'Primitives/Charts/Bar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const data: ChartRow[] = [
  { month: 'Январь', desktop: 186, mobile: 80 },
  { month: 'Февраль', desktop: 305, mobile: 200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: 173, mobile: 190 },
  { month: 'Май', desktop: 209, mobile: 130 },
  { month: 'Июнь', desktop: 214, mobile: 140 },
];

const negative: ChartRow[] = [
  { month: 'Январь', desktop: 186, mobile: -80 },
  { month: 'Февраль', desktop: 305, mobile: -200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: -173, mobile: 190 },
  { month: 'Май', desktop: 209, mobile: -130 },
  { month: 'Июнь', desktop: 214, mobile: 140 },
];

const frame = { width: 560 };

export const Bar: Story = {
  render: () => (
    <div style={frame}>
      <BarChart data={data} xKey="month" series={[{ key: 'desktop', label: 'Десктоп' }]} />
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div style={frame}>
      <BarChart
        data={data}
        xKey="month"
        series={[{ key: 'desktop', label: 'Десктоп' }]}
        layout="horizontal"
      />
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={frame}>
      <BarChart
        data={data}
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

export const Stacked: Story = {
  render: () => (
    <div style={frame}>
      <BarChart
        data={data}
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

export const Labels: Story = {
  render: () => (
    <div style={frame}>
      <BarChart
        data={data}
        xKey="month"
        series={[{ key: 'desktop', label: 'Десктоп' }]}
        labels
      />
    </div>
  ),
};

export const Negative: Story = {
  render: () => (
    <div style={frame}>
      <BarChart
        data={negative}
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
