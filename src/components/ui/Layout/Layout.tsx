import type { CSSProperties, ElementType } from 'react';
import styles from './Layout.module.css';
import { cx } from '../../../lib/cx';

export type Space =
  | 'none'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24'
  | '32';

export type StackDirection = 'column' | 'row';
export type StackAlign = 'stretch' | 'start' | 'center' | 'end' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';
export type GridColumns = 1 | 2 | 3 | 4 | 6;
export type GridMinItemWidth = 's' | 'm' | 'l';

const space: Record<Space, string> = {
  none: '0',
  '1': 'var(--tb-space-1)',
  '2': 'var(--tb-space-2)',
  '3': 'var(--tb-space-3)',
  '4': 'var(--tb-space-4)',
  '5': 'var(--tb-space-5)',
  '6': 'var(--tb-space-6)',
  '8': 'var(--tb-space-8)',
  '10': 'var(--tb-space-10)',
  '12': 'var(--tb-space-12)',
  '16': 'var(--tb-space-16)',
  '20': 'var(--tb-space-20)',
  '24': 'var(--tb-space-24)',
  '32': 'var(--tb-space-32)',
};

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: StackDirection;
  gap?: Space;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
}

export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className,
  style,
  children,
  ...rest
}: StackProps) {
  const spacing = { ...style, '--tb-stack-gap': space[gap] } as CSSProperties;

  return (
    <Tag
      className={cx(styles.stack, className)}
      data-direction={direction}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      style={spacing}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  columns?: GridColumns;
  gap?: Space;
  minItemWidth?: GridMinItemWidth;
}

export function Grid({
  as: Tag = 'div',
  columns = 1,
  gap = '4',
  minItemWidth,
  className,
  style,
  children,
  ...rest
}: GridProps) {
  const spacing = {
    ...style,
    '--tb-grid-gap': space[gap],
    '--tb-grid-columns': String(columns),
  } as CSSProperties;

  return (
    <Tag
      className={cx(styles.grid, className)}
      data-min-item-width={minItemWidth}
      style={spacing}
      {...rest}
    >
      {children}
    </Tag>
  );
}
