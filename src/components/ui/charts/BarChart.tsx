import { useMemo, useState } from 'react';
import styles from './Chart.module.css';
import { ChartGrid, ChartLegend, ChartTooltip, ChartXAxis } from './ChartParts';
import { cx } from '../../../lib/cx';
import {
  bandIndex,
  labelStep,
  paletteColor,
  plotSize,
  seriesColors,
  signedTicks,
  toNumber,
  usePlotWidth,
  valueExtent,
  xAxisMinGap,
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
  const xLabels = data.map((row) => String(row[xKey]));

  const geometry = useMemo(() => {
    const padding = horizontal
      ? { top: 8, right: 16, bottom: grid ? 24 : 8, left: 96 }
      : { top: 8, right: 8, bottom: 24, left: grid ? 48 : 8 };
    const plot = plotSize(width, height, padding);

    const values = series.map((item) => data.map((row) => toNumber(row[item.key])));
    const starts = values.map((rowValues) => rowValues.map(() => 0));
    const ends = values.map((rowValues) => rowValues.map(() => 0));
    values.forEach((rowValues, seriesIndex) => {
      const startRow = starts[seriesIndex];
      const endRow = ends[seriesIndex];
      const previousEndRow = ends[seriesIndex - 1];
      if (startRow === undefined || endRow === undefined) return;
      rowValues.forEach((value, pointIndex) => {
        const previousTop = stacked ? (previousEndRow?.[pointIndex] ?? 0) : 0;
        startRow[pointIndex] = previousTop;
        endRow[pointIndex] = previousTop + value;
      });
    });

    const extent = valueExtent(starts.concat(ends));
    const { min, max, values: tickValues } = signedTicks(extent.min, extent.max, ticks);
    const span = max - min || 1;

    const band = (horizontal ? plot.height : plot.width) / Math.max(data.length, 1);
    const groupSize = stacked ? 1 : series.length;
    const barSize = (band * 0.68) / groupSize;
    const center = (value: number) => {
      const ratio = (value - min) / span;
      return horizontal
        ? padding.left + plot.width * ratio
        : padding.top + plot.height * (1 - ratio);
    };

    const bars = series.map((_, seriesIndex) =>
      data.map((_, pointIndex) => {
        const groupStart =
          (horizontal ? padding.top : padding.left) + band * pointIndex + band * 0.16;
        const offset = groupStart + barSize * (stacked ? 0 : seriesIndex);
        const from = center(starts[seriesIndex]?.[pointIndex] ?? 0);
        const to = center(ends[seriesIndex]?.[pointIndex] ?? 0);
        return {
          start: Math.min(from, to),
          size: Math.max(Math.abs(to - from), 0.5),
          offset,
        };
      })
    );

    return {
      padding,
      plotWidth: plot.width,
      plotHeight: plot.height,
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
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = horizontal
      ? event.clientY - bounds.top - geometry.padding.top
      : event.clientX - bounds.left - geometry.padding.left;
    const index = bandIndex(position, geometry.band, data.length);
    if (index === null) return;
    setHover({ index, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  const label = ariaLabel ?? `График: ${series.map((item) => item.label).join(', ')}`;
  const flipTooltip = hover !== null && width - hover.x < 200;
  const every = labelStep(
    data.length,
    geometry.plotWidth,
    xAxisMinGap(xLabels, plotRef.current, geometry.plotWidth)
  );
  const singleSeries = series.length === 1 ? series[0] : undefined;
  const hoveredRow = hover === null ? undefined : data[hover.index];

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
              <ChartGrid
                ticks={geometry.tickValues}
                format={valueFormat}
                position={geometry.center}
                start={horizontal ? geometry.padding.top : geometry.padding.left}
                end={horizontal ? height - geometry.padding.bottom : width - geometry.padding.right}
                orientation={horizontal ? 'horizontal' : 'vertical'}
                labelGap={horizontal ? 18 : 8}
              />
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

            {!horizontal && (
              <ChartXAxis
                items={xLabels.map((label) => ({ label }))}
                x={(index) => geometry.padding.left + geometry.band * index + geometry.band * 0.5}
                y={height - 6}
                every={every}
                anchor="middle"
              />
            )}

            {series.map((item, seriesIndex) =>
              geometry.bars[seriesIndex]?.map((bar, pointIndex) => (
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
              singleSeries !== undefined &&
              geometry.bars[0]?.map((bar, pointIndex) => {
                const row = data[pointIndex];
                if (row === undefined) return null;
                return (
                  <text
                    key={`label-${pointIndex}`}
                    x={horizontal ? bar.start + bar.size + 6 : bar.offset + geometry.barSize / 2}
                    y={horizontal ? bar.offset + geometry.barSize / 2 : bar.start - 6}
                    textAnchor={horizontal ? 'start' : 'middle'}
                    dominantBaseline={horizontal ? 'middle' : 'auto'}
                    className={styles.tick}
                    style={{ fill: 'var(--tb-text-secondary)' }}
                  >
                    {valueFormat(toNumber(row[singleSeries.key]))}
                  </text>
                );
              })}
          </svg>
        )}

        {tooltip && hover !== null && hoveredRow !== undefined && (
          <ChartTooltip
            left={flipTooltip ? hover.x - 14 : hover.x + 14}
            flip={flipTooltip}
            top={Math.min(Math.max(hover.y - 12, 0), Math.max(height - 80, 0))}
            indicator={tooltipIndicator}
            title={String(hoveredRow[xKey])}
            rows={series.map((item, index) => ({
              label: item.label,
              value: valueFormat(toNumber(hoveredRow[item.key])),
              color: item.color ?? paletteColor(index),
            }))}
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

      <table className="tb-visually-hidden">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{xKey}</th>
            {series.map((item) => (
              <th key={item.key} scope="col">
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={`${String(row[xKey])}-${rowIndex}`}>
              <th scope="row">{String(row[xKey])}</th>
              {series.map((item) => (
                <td key={item.key}>{valueFormat(toNumber(row[item.key]))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
