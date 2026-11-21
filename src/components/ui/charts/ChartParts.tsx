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
      {rows.map((row) => (
        <span key={row.label} className={styles.tooltipRow}>
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
      {items.map((item) => (
        <li key={item.label} className={styles.legendItem}>
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
  y: (value: number) => number;
  left: number;
  right: number;
}

export function ChartGrid({ ticks, format, y, left, right }: ChartGridProps) {
  return (
    <>
      {ticks.map((value) => (
        <g key={value}>
          <line
            x1={left}
            x2={right}
            y1={y(value)}
            y2={y(value)}
            style={{ stroke: 'var(--tb-border)' }}
          />
          <text
            x={left - 8}
            y={y(value)}
            textAnchor="end"
            dominantBaseline="middle"
            className={styles.tick}
          >
            {format(value)}
          </text>
        </g>
      ))}
    </>
  );
}

export interface ChartXAxisProps {
  items: Array<{ label: string | ReactNode }>;
  x: (index: number) => number;
  y: number;
  every: number;
}

export function ChartXAxis({ items, x, y, every }: ChartXAxisProps) {
  return (
    <>
      {items.map((item, index) => {
        if (index % every !== 0 && index !== items.length - 1) return null;
        return (
          <text
            key={`${String(item.label)}-${index}`}
            x={x(index)}
            y={y}
            textAnchor={index === 0 ? 'start' : index === items.length - 1 ? 'end' : 'middle'}
            className={styles.tick}
          >
            {item.label}
          </text>
        );
      })}
    </>
  );
}
