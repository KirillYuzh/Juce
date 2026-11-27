import { useMemo, useState } from 'react';
import styles from './Chart.module.css';
import { CHART_TABLE_ROW_LIMIT, ChartDataTable, ChartLegend, ChartTooltip } from './ChartParts';
import { cx } from '../../../lib/cx';
import {
  arcPath,
  paletteColor,
  seriesColors,
  toNumber,
  usePlotWidth,
  type ChartRow,
  type TooltipIndicator,
} from './chartUtils';

export interface PieChartProps {
  data: ChartRow[];
  nameKey: string;
  valueKey: string;
  height?: number;
  innerRadius?: number;
  centerValue?: string;
  centerLabel?: string;
  legend?: boolean;
  tooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  valueFormat?: (value: number) => string;
  className?: string;
  'aria-label'?: string;
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  height = 240,
  innerRadius = 0.6,
  centerValue,
  centerLabel,
  legend = false,
  tooltip = true,
  tooltipIndicator = 'dot',
  valueFormat = (value) => String(Math.round(value)),
  className,
  'aria-label': ariaLabel,
}: PieChartProps) {
  const [plotRef, width] = usePlotWidth();
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const colors = seriesColors(
    data.map((row) => ({ key: String(row[nameKey]), label: String(row[nameKey]) }))
  );

  const slices = useMemo(() => {
    const values = data.map((row) => toNumber(row[valueKey]));
    const total = values.reduce((sum, value) => sum + Math.max(value, 0), 0);
    const radius = Math.max(Math.min(width, height) / 2 - 4, 0);
    const inner = radius * Math.min(Math.max(innerRadius, 0), 0.95);
    let angle = -Math.PI / 2;

    return data.map((row, index) => {
      const value = values[index] ?? 0;
      const sweep = total > 0 && value > 0 ? (value / total) * Math.PI * 2 : 0;
      const path = arcPath(width / 2, height / 2, inner, radius, angle, angle + sweep);
      angle += sweep;
      return { path, value, label: String(row[nameKey]), sweep };
    });
  }, [data, height, innerRadius, nameKey, valueKey, width]);

  const onPointerMove = (event: React.PointerEvent<SVGPathElement>, index: number) => {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    setHover({ index, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  const label = ariaLabel ?? `Диаграмма: ${data.map((row) => String(row[nameKey])).join(', ')}`;
  const flipTooltip = hover !== null && width - hover.x < 200;
  const hoveredSlice = hover === null ? undefined : slices[hover.index];

  return (
    <div className={cx(styles.chart, className)}>
      <div ref={plotRef} className={styles.plot} style={{ height }}>
        {width > 0 && (
          <svg
            className={styles.svg}
            width={width}
            height={height}
            role="img"
            aria-label={label}
            onPointerLeave={() => setHover(null)}
          >
            {slices.map((slice, index) =>
              slice.sweep > 0 ? (
                <path
                  key={`${slice.label}-${index}`}
                  className={styles.slice}
                  style={{ animationDelay: `${index * 60}ms`, fill: colors[index] }}
                  d={slice.path}
                  stroke="var(--tb-surface)"
                  strokeWidth={2}
                  onPointerMove={(event) => onPointerMove(event, index)}
                />
              ) : null
            )}
          </svg>
        )}

        {(centerValue || centerLabel) && (
          <div className={styles.center}>
            {centerValue && <span className={styles.centerValue}>{centerValue}</span>}
            {centerLabel && <span className={styles.centerLabel}>{centerLabel}</span>}
          </div>
        )}

        {tooltip && hover !== null && hoveredSlice !== undefined && (
          <ChartTooltip
            left={flipTooltip ? hover.x - 14 : hover.x + 14}
            flip={flipTooltip}
            top={Math.min(Math.max(hover.y - 12, 0), Math.max(height - 60, 0))}
            indicator={tooltipIndicator}
            rows={[
              {
                label: hoveredSlice.label,
                value: valueFormat(hoveredSlice.value),
                color: paletteColor(hover.index),
              },
            ]}
          />
        )}
      </div>

      {legend && (
        <ChartLegend
          items={data.map((row, index) => ({
            label: String(row[nameKey]),
            color: paletteColor(index),
          }))}
        />
      )}

      <ChartDataTable
        caption={label}
        rowHeader={nameKey}
        columns={[valueKey]}
        rows={data.slice(0, CHART_TABLE_ROW_LIMIT).map((row, rowIndex) => ({
          key: `${String(row[nameKey])}-${rowIndex}`,
          header: String(row[nameKey]),
          cells: [valueFormat(toNumber(row[valueKey]))],
        }))}
      />
    </div>
  );
}
