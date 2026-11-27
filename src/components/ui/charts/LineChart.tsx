import { useEffect, useMemo, useState } from 'react';
import styles from './Chart.module.css';
import { ChartGrid, ChartLegend, ChartTooltip, ChartXAxis } from './ChartParts';
import { cx } from '../../../lib/cx';
import {
  axisTicks,
  labelStep,
  linePath,
  lineScale,
  plotSize,
  pointerIndex,
  seriesColors,
  toNumber,
  usePlotWidth,
  valueExtent,
  type ChartCurve,
  type ChartRow,
  type ChartSeries,
  type Point,
  type TooltipIndicator,
} from './chartUtils';

export interface LineChartProps {
  data: ChartRow[];
  series: ChartSeries[];
  xKey: string;
  height?: number;
  curve?: ChartCurve;
  dots?: boolean;
  legend?: boolean;
  grid?: boolean;
  ticks?: number;
  tooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  valueFormat?: (value: number) => string;
  className?: string;
  'aria-label'?: string;
}

export function LineChart({
  data,
  series,
  xKey,
  height = 240,
  curve = 'smooth',
  dots = false,
  legend = false,
  grid = true,
  ticks = 4,
  tooltip = true,
  tooltipIndicator = 'dot',
  valueFormat = (value) => String(Math.round(value)),
  className,
  'aria-label': ariaLabel,
}: LineChartProps) {
  const [plotRef, width] = usePlotWidth();
  const [hovered, setHovered] = useState<number | null>(null);
  const colors = seriesColors(series);

  useEffect(() => {
    setHovered((current) => (current !== null && current >= data.length ? null : current));
  }, [data.length]);

  const geometry = useMemo(() => {
    const padding = { top: 8, right: 8, bottom: 24, left: grid ? 44 : 8 };
    const plot = plotSize(width, height, padding);

    const values = series.map((item) => data.map((row) => toNumber(row[item.key])));
    const { max } = valueExtent(values);
    const { max: axisMax, values: tickValues } = axisTicks(max, ticks);

    const x = lineScale(data.length, plot.width, padding.left);
    const y = (value: number) => padding.top + plot.height * (1 - value / axisMax);

    const lines = values.map((rowValues) => {
      const points = rowValues.map((value, index) => [x(index), y(value)] as Point);
      return { path: linePath(points, curve), points };
    });

    return {
      padding,
      plotWidth: plot.width,
      x,
      y,
      lines,
      tickValues,
      every: labelStep(data.length, plot.width),
    };
  }, [curve, data, grid, height, series, ticks, width]);

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
              items={data.map((row) => ({ label: String(row[xKey]) }))}
              x={geometry.x}
              y={height - 6}
              every={geometry.every}
            />

            {geometry.lines.map((line, index) => (
              <path
                key={`line-${series[index].key}`}
                className={styles.line}
                style={{ animationDelay: `${index * 60}ms`, stroke: colors[index] }}
                d={line.path}
                pathLength={1}
                fill="none"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {dots &&
              geometry.lines.map((line, index) =>
                line.points.map(([x, y], pointIndex) => (
                  <circle
                    key={`dot-${series[index].key}-${pointIndex}`}
                    className={styles.dot}
                    style={{ animationDelay: `${index * 60 + 120}ms`, fill: colors[index] }}
                    cx={x}
                    cy={y}
                    r={3}
                  />
                ))
              )}

            {active !== null && (
              <g pointerEvents="none">
                <line
                  x1={geometry.x(active)}
                  x2={geometry.x(active)}
                  y1={geometry.padding.top}
                  y2={height - geometry.padding.bottom}
                  style={{ stroke: 'var(--tb-border-strong)' }}
                />
                {geometry.lines.map((line, index) => (
                  <circle
                    key={`hover-${series[index].key}`}
                    cx={line.points[active][0]}
                    cy={line.points[active][1]}
                    r={4}
                    strokeWidth={2}
                    style={{ fill: colors[index], stroke: 'var(--tb-surface)' }}
                  />
                ))}
              </g>
            )}
          </svg>
        )}

        {tooltip && active !== null && (
          <ChartTooltip
            left={flipTooltip ? tooltipX - 14 : tooltipX + 14}
            flip={flipTooltip}
            indicator={tooltipIndicator}
            title={String(data[active][xKey])}
            rows={series.map((item, index) => ({
              label: item.label,
              value: valueFormat(toNumber(data[active][item.key])),
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
