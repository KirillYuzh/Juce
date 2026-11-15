import { useId, useMemo, useState } from 'react';
import styles from './Chart.module.css';
import { ChartGrid, ChartLegend, ChartTooltip, ChartXAxis } from './ChartParts';
import {
  axisTicks,
  cx,
  labelStep,
  linePath,
  seriesColors,
  toNumber,
  usePlotWidth,
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
  const gradientId = useId().replace(/:/g, '');
  const colors = seriesColors(series);

  const geometry = useMemo(() => {
    const padding = { top: 8, right: 8, bottom: 24, left: grid ? 44 : 8 };
    const plotWidth = Math.max(width - padding.left - padding.right, 0);
    const plotHeight = Math.max(height - padding.top - padding.bottom, 0);

    const lower = series.map(() => data.map(() => 0));
    const values = series.map((item) => data.map((row) => toNumber(row[item.key])));
    if (stacked) {
      values.forEach((rowValues, seriesIndex) => {
        if (seriesIndex === 0) return;
        rowValues.forEach((_, pointIndex) => {
          lower[seriesIndex][pointIndex] =
            lower[seriesIndex - 1][pointIndex] + values[seriesIndex - 1][pointIndex];
        });
      });
    }
    const upper = values.map((rowValues, seriesIndex) =>
      rowValues.map((value, pointIndex) => value + lower[seriesIndex][pointIndex])
    );

    const { max: axisMax, values: tickValues } = axisTicks(Math.max(1, ...upper.flat()), ticks);

    const x = (index: number) =>
      padding.left + (data.length > 1 ? (plotWidth * index) / (data.length - 1) : plotWidth / 2);
    const y = (value: number) => padding.top + plotHeight * (1 - value / axisMax);

    const bands = series.map((_, seriesIndex) => {
      const top = upper[seriesIndex].map((value, index) => [x(index), y(value)] as Point);
      const bottom = lower[seriesIndex].map((value, index) => [x(index), y(value)] as Point);
      const line = linePath(top, curve);
      const area = `${line}${linePath([...bottom].reverse(), curve).replace(/^M/, 'L')}Z`;
      return { line, area, top };
    });

    return {
      padding,
      plotWidth,
      x,
      y,
      bands,
      tickValues,
      every: labelStep(data.length, plotWidth),
    };
  }, [curve, data, grid, height, series, stacked, ticks, width]);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio =
      data.length > 1
        ? (event.clientX - bounds.left - geometry.padding.left) / Math.max(geometry.plotWidth, 1)
        : 0.5;
    const index = Math.round(ratio * (data.length - 1));
    setHovered(Math.min(Math.max(index, 0), data.length - 1));
  };

  const label = ariaLabel ?? `График: ${series.map((item) => item.label).join(', ')}`;
  // Тултип всегда сбоку от точки: иначе он закрывает точку у верхнего края.
  const tooltipX = hovered === null ? 0 : geometry.x(hovered);
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
                y={geometry.y}
                left={geometry.padding.left}
                right={width - geometry.padding.right}
              />
            )}

            <ChartXAxis
              items={data.map((row) => ({ label: String(row[xKey]) }))}
              x={geometry.x}
              y={height - 6}
              every={geometry.every}
            />

            {fill === 'gradient' &&
              geometry.bands.map((band, index) => (
                <path
                  key={`area-${series[index].key}`}
                  className={styles.area}
                  style={{ animationDelay: `${index * 60}ms` }}
                  d={band.area}
                  fill={`url(#${gradientId}-${index})`}
                />
              ))}

            {geometry.bands.map((band, index) => (
              <path
                key={`line-${series[index].key}`}
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

            {hovered !== null && (
              <g pointerEvents="none">
                <line
                  x1={geometry.x(hovered)}
                  x2={geometry.x(hovered)}
                  y1={geometry.padding.top}
                  y2={height - geometry.padding.bottom}
                  style={{ stroke: 'var(--tb-border-strong)' }}
                />
                {geometry.bands.map((band, index) => (
                  <circle
                    key={`dot-${series[index].key}`}
                    cx={band.top[hovered][0]}
                    cy={band.top[hovered][1]}
                    r={4}
                    strokeWidth={2}
                    style={{ fill: colors[index], stroke: 'var(--tb-surface)' }}
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        {tooltip && hovered !== null && data[hovered] && (
          <ChartTooltip
            left={flipTooltip ? tooltipX - 14 : tooltipX + 14}
            flip={flipTooltip}
            indicator={tooltipIndicator}
            title={String(data[hovered][xKey])}
            rows={series.map((item, index) => ({
              label: item.label,
              value: valueFormat(toNumber(data[hovered][item.key])),
              color: colors[index],
            }))}
            top={8}
          />
        )}
      </div>

      {legend && (
        <ChartLegend
          items={series.map((item, index) => ({ label: item.label, color: colors[index] }))}
        />
      )}
    </div>
  );
}
