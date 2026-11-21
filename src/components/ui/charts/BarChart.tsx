import { useMemo, useState } from 'react';
import styles from './Chart.module.css';
import { ChartLegend, ChartTooltip } from './ChartParts';
import { cx } from '../../../lib/cx';
import {
  labelStep,
  seriesColors,
  signedTicks,
  toNumber,
  usePlotWidth,
  type ChartRow,
  type ChartSeries,
  type TooltipIndicator,
} from './chartUtils';

export interface BarChartProps {
  data: ChartRow[];
  series: ChartSeries[];
  xKey: string;
  height?: number;
  layout?: 'vertical' | 'horizontal';
  stacked?: boolean;
  legend?: boolean;
  grid?: boolean;
  ticks?: number;
  labels?: boolean;
  tooltip?: boolean;
  tooltipIndicator?: TooltipIndicator;
  valueFormat?: (value: number) => string;
  className?: string;
  'aria-label'?: string;
}

export function BarChart({
  data,
  series,
  xKey,
  height = 240,
  layout = 'vertical',
  stacked = false,
  legend = false,
  grid = true,
  ticks = 4,
  labels = false,
  tooltip = true,
  tooltipIndicator = 'dot',
  valueFormat = (value) => String(Math.round(value)),
  className,
  'aria-label': ariaLabel,
}: BarChartProps) {
  const [plotRef, width] = usePlotWidth();
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);
  const colors = seriesColors(series);
  const horizontal = layout === 'horizontal';

  const geometry = useMemo(() => {
    const padding = horizontal
      ? { top: 8, right: 16, bottom: grid ? 24 : 8, left: 96 }
      : { top: 8, right: 8, bottom: 24, left: grid ? 48 : 8 };
    const plotWidth = Math.max(width - padding.left - padding.right, 0);
    const plotHeight = Math.max(height - padding.top - padding.bottom, 0);

    const values = series.map((item) => data.map((row) => toNumber(row[item.key])));
    const starts = series.map(() => data.map(() => 0));
    const ends = series.map(() => data.map(() => 0));
    values.forEach((rowValues, seriesIndex) => {
      rowValues.forEach((value, pointIndex) => {
        const previousTop = seriesIndex === 0 ? 0 : ends[seriesIndex - 1][pointIndex];
        starts[seriesIndex][pointIndex] = stacked ? previousTop : 0;
        ends[seriesIndex][pointIndex] = starts[seriesIndex][pointIndex] + value;
      });
    });

    const {
      min,
      max,
      values: tickValues,
    } = signedTicks(
      Math.min(0, ...starts.flat(), ...ends.flat()),
      Math.max(0, ...starts.flat(), ...ends.flat()),
      ticks
    );
    const span = max - min || 1;

    const band = (horizontal ? plotHeight : plotWidth) / Math.max(data.length, 1);
    const groupSize = stacked ? 1 : series.length;
    const barSize = (band * 0.68) / groupSize;
    const center = (value: number) => {
      const ratio = (value - min) / span;
      return horizontal ? padding.left + plotWidth * ratio : padding.top + plotHeight * (1 - ratio);
    };

    const bars = series.map((_, seriesIndex) =>
      data.map((_, pointIndex) => {
        const groupStart =
          (horizontal ? padding.top : padding.left) + band * pointIndex + band * 0.16;
        const offset = groupStart + barSize * (stacked ? 0 : seriesIndex);
        const from = center(starts[seriesIndex][pointIndex]);
        const to = center(ends[seriesIndex][pointIndex]);
        return {
          start: Math.min(from, to),
          size: Math.max(Math.abs(to - from), 0.5),
          offset,
        };
      })
    );

    return {
      padding,
      plotWidth,
      plotHeight,
      band,
      barSize,
      center,
      bars,
      tickValues,
      min,
      max,
    };
  }, [data, grid, height, horizontal, series, stacked, ticks, width]);

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (data.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = horizontal
      ? event.clientY - bounds.top - geometry.padding.top
      : event.clientX - bounds.left - geometry.padding.left;
    const index = Math.min(
      Math.max(Math.floor(position / Math.max(geometry.band, 1)), 0),
      data.length - 1
    );
    setHover({ index, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  const label = ariaLabel ?? `График: ${series.map((item) => item.label).join(', ')}`;
  const flipTooltip = hover !== null && width - hover.x < 200;

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
            onPointerLeave={() => setHover(null)}
          >
            {grid && (
              <g>
                {geometry.tickValues.map((value) => {
                  const line = geometry.center(value);
                  return (
                    <g key={value}>
                      <line
                        x1={horizontal ? line : geometry.padding.left}
                        x2={horizontal ? line : width - geometry.padding.right}
                        y1={horizontal ? geometry.padding.top : line}
                        y2={horizontal ? height - geometry.padding.bottom : line}
                        style={{ stroke: 'var(--tb-border)' }}
                      />
                      <text
                        x={horizontal ? line : geometry.padding.left - 8}
                        y={horizontal ? height - 6 : line}
                        textAnchor={horizontal ? 'middle' : 'end'}
                        dominantBaseline={horizontal ? 'auto' : 'middle'}
                        className={styles.tick}
                      >
                        {valueFormat(value)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {horizontal &&
              data.map((row, index) => (
                <text
                  key={`${String(row[xKey])}-${index}`}
                  x={geometry.padding.left - 12}
                  y={
                    geometry.padding.top +
                    geometry.band * index +
                    geometry.band * 0.16 +
                    geometry.barSize / 2
                  }
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.tick}
                >
                  {String(row[xKey])}
                </text>
              ))}

            {!horizontal &&
              data.map((row, index) => {
                const every = labelStep(data.length, geometry.plotWidth);
                if (index % every !== 0 && index !== data.length - 1) return null;
                return (
                  <text
                    key={`${String(row[xKey])}-${index}`}
                    x={geometry.padding.left + geometry.band * index + geometry.band * 0.5}
                    y={height - 6}
                    textAnchor="middle"
                    className={styles.tick}
                  >
                    {String(row[xKey])}
                  </text>
                );
              })}

            {series.map((item, seriesIndex) =>
              geometry.bars[seriesIndex].map((bar, pointIndex) => (
                <rect
                  key={`${item.key}-${pointIndex}`}
                  className={horizontal ? styles.barHorizontal : styles.barVertical}
                  style={{ animationDelay: `${pointIndex * 24}ms`, fill: colors[seriesIndex] }}
                  x={horizontal ? bar.start : bar.offset}
                  y={horizontal ? bar.offset : bar.start}
                  width={horizontal ? bar.size : geometry.barSize}
                  height={horizontal ? geometry.barSize : bar.size}
                  rx={4}
                  pointerEvents="none"
                />
              ))
            )}

            {labels &&
              series.length === 1 &&
              geometry.bars[0].map((bar, pointIndex) => (
                <text
                  key={`label-${pointIndex}`}
                  x={horizontal ? bar.start + bar.size + 6 : bar.offset + geometry.barSize / 2}
                  y={horizontal ? bar.offset + geometry.barSize / 2 : bar.start - 6}
                  textAnchor={horizontal ? 'start' : 'middle'}
                  dominantBaseline={horizontal ? 'middle' : 'auto'}
                  className={styles.tick}
                  style={{ fill: 'var(--tb-text-secondary)' }}
                >
                  {valueFormat(toNumber(data[pointIndex][series[0].key]))}
                </text>
              ))}
          </svg>
        )}

        {tooltip && hover !== null && data[hover.index] && (
          <ChartTooltip
            left={flipTooltip ? hover.x - 14 : hover.x + 14}
            flip={flipTooltip}
            top={Math.min(Math.max(hover.y - 12, 0), Math.max(height - 80, 0))}
            indicator={tooltipIndicator}
            title={String(data[hover.index][xKey])}
            rows={series.map((item, index) => ({
              label: item.label,
              value: valueFormat(toNumber(data[hover.index][item.key])),
              color: colors[index],
            }))}
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
