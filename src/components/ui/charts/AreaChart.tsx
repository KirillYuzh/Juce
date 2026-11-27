import { useEffect, useMemo, useState } from 'react';
import styles from './Chart.module.css';
import {
  CHART_TABLE_ROW_LIMIT,
  ChartDataTable,
  ChartGrid,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
} from './ChartParts';
import { cx } from '../../../lib/cx';
import { useDomId } from '../../../lib/use-id';
import {
  labelStep,
  linePath,
  lineScale,
  paletteColor,
  plotSize,
  pointerIndex,
  seriesColors,
  toNumber,
  usePlotWidth,
  valueExtent,
  valueTicks,
  xAxisMinGap,
  type ChartCurve,
  type ChartRow,
  type ChartSeries,
  type Point,
  type TooltipIndicator,
} from './chartUtils';

export type AreaFill = 'gradient' | 'none';

export interface AreaChartProps {
  data: ChartRow[];
  series: ChartSeries[];
  xKey: string;
  height?: number;
  curve?: ChartCurve;
  fill?: AreaFill;
  stacked?: boolean;
  legend?: boolean;
  grid?: boolean;
  ticks?: number;
  tooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  valueFormat?: (value: number) => string;
  className?: string;
  'aria-label'?: string;
}

export function AreaChart({
  data,
  series,
  xKey,
  height = 240,
  curve = 'smooth',
  fill = 'gradient',
  stacked = false,
  legend = false,
  grid = true,
  ticks = 4,
  tooltip = true,
  tooltipIndicator = 'dot',
  valueFormat = (value) => String(Math.round(value)),
  className,
  'aria-label': ariaLabel,
}: AreaChartProps) {
  const [plotRef, width] = usePlotWidth();
  const [hovered, setHovered] = useState<number | null>(null);
  const gradientId = useDomId();
  const colors = seriesColors(series);
  const labels = data.map((row) => String(row[xKey]));

  useEffect(() => {
    setHovered((current) => (current !== null && current >= data.length ? null : current));
  }, [data.length]);

  const geometry = useMemo(() => {
    const padding = { top: 8, right: 8, bottom: 24, left: grid ? 44 : 8 };
    const plot = plotSize(width, height, padding);

    const lower = series.map(() => data.map(() => 0));
    const values = series.map((item) => data.map((row) => toNumber(row[item.key])));
    if (stacked) {
      for (let seriesIndex = 1; seriesIndex < values.length; seriesIndex += 1) {
        const currentLower = lower[seriesIndex];
        const previousLower = lower[seriesIndex - 1];
        const previousValues = values[seriesIndex - 1];
        if (currentLower === undefined || previousLower === undefined) continue;
        for (let pointIndex = 0; pointIndex < currentLower.length; pointIndex += 1) {
          currentLower[pointIndex] =
            (previousLower[pointIndex] ?? 0) + (previousValues?.[pointIndex] ?? 0);
        }
      }
    }
    const upper = values.map((rowValues, seriesIndex) => {
      const lowerRow = lower[seriesIndex];
      return rowValues.map((value, pointIndex) => value + (lowerRow?.[pointIndex] ?? 0));
    });

    const extent = valueExtent([...upper, ...lower]);
    const {
      min: axisMin,
      max: axisMax,
      values: tickValues,
    } = valueTicks(extent.min, extent.max, ticks);
    const span = axisMax - axisMin || 1;

    const x = lineScale(data.length, plot.width, padding.left);
    const y = (value: number) => padding.top + plot.height * (1 - (value - axisMin) / span);

    const bands = series.map((item, seriesIndex) => {
      const upperRow = upper[seriesIndex] ?? [];
      const lowerRow = lower[seriesIndex] ?? [];
      const top = upperRow.map((value, index) => [x(index), y(value)] as Point);
      const bottom = lowerRow.map((value, index) => [x(index), y(value)] as Point);
      const line = linePath(top, curve);
      const area = `${line}${linePath([...bottom].reverse(), curve).replace(/^M/, 'L')}Z`;
      return { key: item.key, line, area, top };
    });

    return {
      padding,
      plotWidth: plot.width,
      x,
      y,
      bands,
      tickValues,
    };
  }, [curve, data, grid, height, series, stacked, ticks, width]);

  const every = labelStep(
    data.length,
    geometry.plotWidth,
    xAxisMinGap(labels, plotRef.current, geometry.plotWidth)
  );

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const index = pointerIndex(
      event.clientX - bounds.left,
      geometry.plotWidth,
      geometry.padding.left,
      data.length
    );
    if (index === null) return;
    setHovered(index);
  };

  const label = ariaLabel ?? `График: ${series.map((item) => item.label).join(', ')}`;
  const active = hovered !== null && hovered < data.length ? hovered : null;
  const activeRow = active === null ? undefined : data[active];
  const tooltipX = active === null ? 0 : geometry.x(active);
  const flipTooltip = width - tooltipX < 190 && tooltipX > 190;

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
            onPointerMove={onPointerMove}
            onPointerLeave={() => setHovered(null)}
          >
            {fill === 'gradient' && (
              <defs>
                {series.map((item, index) => (
                  <linearGradient
                    key={item.key}
                    id={`${gradientId}-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" style={{ stopColor: colors[index], stopOpacity: 0.32 }} />
                    <stop offset="100%" style={{ stopColor: colors[index], stopOpacity: 0.02 }} />
                  </linearGradient>
                ))}
              </defs>
            )}

            {grid && (
              <ChartGrid
                ticks={geometry.tickValues}
                format={valueFormat}
                position={geometry.y}
                start={geometry.padding.left}
                end={width - geometry.padding.right}
              />
            )}

            <ChartXAxis
              items={labels.map((label) => ({ label }))}
              x={geometry.x}
              y={height - 6}
              every={every}
            />

            {data.length > 0 &&
              fill === 'gradient' &&
              geometry.bands.map((band, index) => (
                <path
                  key={`area-${band.key}`}
                  className={styles.area}
                  style={{ animationDelay: `${index * 60}ms` }}
                  d={band.area}
                  fill={`url(#${gradientId}-${index})`}
                />
              ))}

            {data.length > 0 &&
              geometry.bands.map((band, index) => (
                <path
                  key={`line-${band.key}`}
                  className={styles.line}
                  style={{ animationDelay: `${index * 60}ms`, stroke: colors[index] }}
                  d={band.line}
                  pathLength={1}
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

            {active !== null && (
              <g pointerEvents="none">
                <line
                  x1={geometry.x(active)}
                  x2={geometry.x(active)}
                  y1={geometry.padding.top}
                  y2={height - geometry.padding.bottom}
                  style={{ stroke: 'var(--tb-border-strong)' }}
                />
                {geometry.bands.map((band, index) => {
                  const point = band.top[active];
                  if (point === undefined) return null;
                  return (
                    <circle
                      key={`dot-${band.key}`}
                      cx={point[0]}
                      cy={point[1]}
                      r={4}
                      strokeWidth={2}
                      style={{ fill: colors[index], stroke: 'var(--tb-surface)' }}
                    />
                  );
                })}
              </g>
            )}
          </svg>
        )}

        {tooltip && active !== null && activeRow !== undefined && (
          <ChartTooltip
            left={flipTooltip ? tooltipX - 14 : tooltipX + 14}
            flip={flipTooltip}
            indicator={tooltipIndicator}
            title={String(activeRow[xKey])}
            rows={series.map((item, index) => ({
              label: item.label,
              value: valueFormat(toNumber(activeRow[item.key])),
              color: item.color ?? paletteColor(index),
            }))}
            top={8}
          />
        )}
      </div>

      {legend && (
        <ChartLegend
          items={series.map((item, index) => ({
            label: item.label,
            color: item.color ?? paletteColor(index),
          }))}
        />
      )}

      <ChartDataTable
        caption={label}
        rowHeader={xKey}
        columns={series.map((item) => item.label)}
        rows={data.slice(0, CHART_TABLE_ROW_LIMIT).map((row, rowIndex) => ({
          key: `${String(row[xKey])}-${rowIndex}`,
          header: String(row[xKey]),
          cells: series.map((item) => valueFormat(toNumber(row[item.key]))),
        }))}
      />
    </div>
  );
}
