import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DatePicker, defaultRangePresets, type DateRangePreset } from './DatePicker';
import { addDays, addMonths, endOfMonth, startOfMonth, today, type DateRange } from '../../../lib/date';

const meta: Meta = {
  title: 'Primitives/Date picker',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

function SinglePicker() {
  const [value, setValue] = useState<Date | null>(today());
  return <DatePicker mode="single" value={value} onChange={setValue} />;
}

export const Single: Story = {
  render: () => <SinglePicker />,
};

const lastMonthPreset: DateRangePreset = {
  label: 'Прошлый месяц',
  getRange: () => {
    const lastMonth = addMonths(today(), -1);
    return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
  },
};

function RangePicker() {
  const [value, setValue] = useState<DateRange | null>({
    from: addDays(today(), -6),
    to: today(),
  });
  return (
    <DatePicker
      mode="range"
      value={value}
      onChange={setValue}
      presets={[...defaultRangePresets, lastMonthPreset]}
    />
  );
}

export const RangeWithPresets: Story = {
  render: () => <RangePicker />,
};

function MinMaxPicker() {
  const [value, setValue] = useState<Date | null>(null);
  return (
    <DatePicker
      mode="single"
      value={value}
      onChange={setValue}
      min={addDays(today(), -10)}
      max={addDays(today(), 10)}
      placeholder="Доступны 3 недели"
    />
  );
}

export const MinMax: Story = {
  render: () => <MinMaxPicker />,
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <DatePicker mode="single" value={today()} disabled />
      <DatePicker
        mode="range"
        value={{ from: addDays(today(), -6), to: today() }}
        disabled
      />
    </div>
  ),
};
