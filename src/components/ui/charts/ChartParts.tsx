import type { ReactNode } from 'react';
import styles from './Chart.module.css';
import { cx } from '../../../lib/cx';
import type { TooltipIndicator } from './chartUtils';

export interface ChartTooltipRow {
  label: string;
  value: string;
  color: string;
}

export interface ChartTooltipProps {
  left: number;
  top?: number;
  title?: string;
  rows: ChartTooltipRow[];
  indicator?: TooltipIndicator;
  flip?: boolean;
}

export function ChartTooltip({
  left,
  top = 0,
  title,
  rows,
  indicator = 'dot',
  flip = false,
}: ChartTooltipProps) {
  return (
    <div
      className={styles.tooltip}
      style={{ left, top, transform: flip ? 'translateX(-100%)' : undefined }}
    >
      {title && <span className={styles.tooltipTitle}>{title}</span>}
      {rows.map((row, index) => (
        <span key={`${row.label}-${index}`} className={styles.tooltipRow}>
          {indicator !== 'none' && (
            <span
              className={cx(styles.tooltipIndicator, styles[`indicator-${indicator}`])}
              style={{ '--indicator-color': row.color } as React.CSSProperties}
            />
          )}
          <span className={styles.tooltipLabel}>{row.label}</span>
          <span className={styles.tooltipValue}>{row.value}</span>
        </span>
      ))}
    </div>
  );
}

export interface ChartLegendProps {
  items: Array<{ label: string; color: string }>;
}

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <ul className={styles.legend}>
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: item.color }} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export interface ChartGridProps {
  ticks: number[];
  format: (value: number) => string;
  position: (value: number) => number;
  start: number;
  end: number;
  orientation?: 'vertical' | 'horizontal';
  labelGap?: number;
}

export function ChartGrid({
  ticks,
  format,
  position,
  start,
  end,
  orientation = 'vertical',
  labelGap = 8,
}: ChartGridProps) {
  const horizontal = orientation === 'horizontal';
  return (
    <>
      {ticks.map((value) => {
        const at = position(value);
        return (
          <g key={value}>
            <line
              x1={horizontal ? at : start}
              x2={horizontal ? at : end}
              y1={horizontal ? start : at}
              y2={horizontal ? end : at}
              style={{ stroke: 'var(--tb-border)' }}
            />
            <text
              x={horizontal ? at : start - labelGap}
              y={horizontal ? end + labelGap : at}
              textAnchor={horizontal ? 'middle' : 'end'}
              dominantBaseline={horizontal ? 'auto' : 'middle'}
              className={styles.tick}
            >
              {format(value)}
            </text>
          </g>
        );
      })}
    </>
  );
}

export interface ChartXAxisProps {
  items: Array<{ label: string | ReactNode }>;
  x: (index: number) => number;
  y: number;
  every: number;
  anchor?: 'edges' | 'middle';
}

export function ChartXAxis({ items, x, y, every, anchor = 'edges' }: ChartXAxisProps) {
  return (
    <>
      {items.map((item, index) => {
        if (index % every !== 0 && index !== items.length - 1) return null;
        const textAnchor =
          anchor === 'middle'
            ? 'middle'
            : index === 0
              ? 'start'
              : index === items.length - 1
                ? 'end'
                : 'middle';
        return (
          <text
            key={`${String(item.label)}-${index}`}
            x={x(index)}
            y={y}
            textAnchor={textAnchor}
            className={styles.tick}
          >
            {item.label}
          </text>
        );
      })}
    </>
  );
}
