import { useEffect, useRef, useState } from 'react';
import { clamp } from '../../../lib/clamp';

export type ChartCurve = 'smooth' | 'linear' | 'step';
export type ChartRow = Record<string, string | number>;
export type TooltipIndicator = 'dot' | 'line' | 'dashed' | 'none';

export interface ChartSeries {
  key: string;
  label: string;
  color?: string;
}

export type Point = [number, number];

const PALETTE = ['--tb-chart-1', '--tb-chart-2', '--tb-chart-3', '--tb-chart-4'];

export const seriesColors = (series: ChartSeries[]) =>
  series.map((item, index) => item.color ?? `var(${PALETTE[index % PALETTE.length]})`);

export const toNumber = (value: string | number | undefined) => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(raw || 1));
  const norm = (raw || 1) / power;
  return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * power;
}

export function axisTicks(maxValue: number, count: number) {
  const step = niceStep(Math.max(maxValue, 1) / Math.max(count - 1, 1));
  const max = Math.max(Math.ceil(Math.max(maxValue, 1) / step) * step, step);
  const values: number[] = [];
  for (let value = 0; value <= max + step / 1000; value += step) values.push(value);
  return { max, step, values };
}

export function signedTicks(minValue: number, maxValue: number, count: number) {
  const span = Math.max(maxValue - minValue, 1);
  const step = niceStep(span / Math.max(count - 1, 1));
  const min = Math.floor(minValue / step) * step;
  const max = Math.ceil(maxValue / step) * step;
  const values: number[] = [];
  for (let value = min; value <= max + step / 1000; value += step) values.push(value);
  return { min, max, step, values };
}

export function linePath(points: Point[], curve: ChartCurve) {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  let path = `M${first[0]},${first[1]}`;

  if (curve === 'step') {
    rest.forEach(([x, y], index) => {
      const previous = points[index];
      path += `H${(previous[0] + x) / 2}V${y}H${x}`;
    });
    return path;
  }

  if (curve === 'linear') {
    rest.forEach(([x, y]) => {
      path += `L${x},${y}`;
    });
    return path;
  }

  for (let index = 1; index < points.length; index += 1) {
    const p0 = points[index - 2] ?? points[index - 1];
    const p1 = points[index - 1];
    const p2 = points[index];
    const p3 = points[index + 1] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    path += `C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return path;
}

export function arcPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number
) {
  const point = (angle: number, radius: number): Point => [
    cx + radius * Math.cos(angle),
    cy + radius * Math.sin(angle),
  ];
  const sweep = endAngle - startAngle;
  const full = Math.abs(sweep) >= Math.PI * 2 - 1e-9;
  const largeArc = full || sweep > Math.PI ? 1 : 0;
  const arcs = (radius: number, outer: boolean, angles: number[]) =>
    angles
      .map((angle) => {
        const [x, y] = point(angle, radius);
        return `A${radius},${radius} 0 ${largeArc} ${outer ? 1 : 0} ${x},${y}`;
      })
      .join('');
  const [x1, y1] = point(startAngle, outerRadius);
  const outerArcs = arcs(outerRadius, true, full ? [startAngle + sweep / 2, endAngle] : [endAngle]);
  if (innerRadius <= 0) {
    return `M${cx},${cy}L${x1},${y1}${outerArcs}Z`;
  }
  const [x3, y3] = point(endAngle, innerRadius);
  const innerArcs = arcs(
    innerRadius,
    false,
    full ? [endAngle - sweep / 2, startAngle] : [startAngle]
  );
  return `M${x1},${y1}${outerArcs}L${x3},${y3}${innerArcs}Z`;
}

export function labelStep(count: number, plotWidth: number, minGap = 64) {
  return Math.max(1, Math.ceil(count / Math.max(2, Math.floor(plotWidth / minGap))));
}

export interface PlotPadding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function plotSize(width: number, height: number, padding: PlotPadding) {
  return {
    width: Math.max(width - padding.left - padding.right, 0),
    height: Math.max(height - padding.top - padding.bottom, 0),
  };
}

export function lineScale(count: number, plotWidth: number, left: number) {
  return (index: number) => left + (count > 1 ? (plotWidth * index) / (count - 1) : plotWidth / 2);
}

export function pointerIndex(position: number, plotWidth: number, left: number, count: number) {
  if (count === 0) return null;
  const ratio = count > 1 ? (position - left) / Math.max(plotWidth, 1) : 0.5;
  return clamp(Math.round(ratio * (count - 1)), 0, count - 1);
}

export function bandIndex(position: number, band: number, count: number) {
  if (count === 0) return null;
  return clamp(Math.floor(position / Math.max(band, 1)), 0, count - 1);
}

export function valueExtent(groups: number[][]) {
  let min = 0;
  let max = 0;
  for (const values of groups) {
    for (const value of values) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }
  return { min, max };
}

export function usePlotWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}
