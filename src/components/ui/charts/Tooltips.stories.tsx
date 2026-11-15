import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarChart } from './BarChart';
import { LineChart } from './LineChart';
import type { ChartRow } from './chartUtils';

const meta: Meta = {
  title: 'Primitives/Charts/Tooltips',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const data: ChartRow[] = [
  { month: 'Январь', visitors: 186 },
  { month: 'Февраль', visitors: 305 },
  { month: 'Март', visitors: 237 },
  { month: 'Апрель', visitors: 73 },
  { month: 'Май', visitors: 209 },
  { month: 'Июнь', visitors: 214 },
];

const series = [{ key: 'visitors', label: 'Посетители' }];
const row = { display: 'flex', flexDirection: 'column' as const, gap: 4, width: 520 };
const caption = { font: '500 12px/18px var(--tb-font-text)', color: 'var(--tb-text-secondary)' };

export const IndicatorDot: Story = {
  name: 'Indicator: dot',
  render: () => (
    <div style={row}>
      <span style={caption}>По умолчанию — цветная точка</span>
      <LineChart data={data} xKey="month" series={series} height={180} tooltipIndicator="dot" />
    </div>
  ),
};

export const IndicatorLine: Story = {
  name: 'Indicator: line',
  render: () => (
    <div style={row}>
      <span style={caption}>Вертикальная плашка, как в shadcn</span>
      <LineChart data={data} xKey="month" series={series} height={180} tooltipIndicator="line" />
    </div>
  ),
};

export const IndicatorDashed: Story = {
  name: 'Indicator: dashed',
  render: () => (
    <div style={row}>
      <span style={caption}>Пунктирная засечка</span>
      <BarChart data={data} xKey="month" series={series} height={180} tooltipIndicator="dashed" />
    </div>
  ),
};

export const IndicatorHidden: Story = {
  name: 'Indicator: hidden',
  render: () => (
    <div style={row}>
      <span style={caption}>Без индикатора</span>
      <BarChart data={data} xKey="month" series={series} height={180} tooltipIndicator="none" />
    </div>
  ),
};

export const FormattedValues: Story = {
  name: 'Formatted values',
  render: () => (
    <div style={row}>
      <span style={caption}>Свой формат значений</span>
      <LineChart
        data={data}
        xKey="month"
        series={series}
        height={180}
        valueFormat={(value) => `${Math.round(value)} чел.`}
        tooltipIndicator="line"
      />
    </div>
  ),
};

export const WithoutTooltip: Story = {
  name: 'Without tooltip',
  render: () => (
    <div style={row}>
      <span style={caption}>Тултип выключен</span>
      <LineChart data={data} xKey="month" series={series} height={180} tooltip={false} />
    </div>
  ),
};
