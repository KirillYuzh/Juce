import { useEffect, useState } from 'react';
import type { CSSProperties, ElementType } from 'react';
import { cx } from '../../../lib/cx';
import styles from './Shimmer.module.css';

const EXIT_MS = 300;

export interface ShimmerProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  active?: boolean;
  reverse?: boolean;
  once?: boolean;
  duration?: string;
  angle?: string;
  /** Controlled text; wins over values. */
  value?: string;
  /** Rotating status lines; cycles every interval ms. */
  values?: readonly string[];
  /** Default 2600. */
  interval?: number;
}

export function Shimmer({
  as: Tag = 'span',
  active = true,
  reverse = false,
  once = false,
  duration,
  angle,
  value,
  values,
  interval = 2600,
  className,
  style,
  children,
  ...rest
}: ShimmerProps) {
  const [index, setIndex] = useState(0);
  const rotationSize = value === undefined && values ? values.length : 0;

  useEffect(() => {
    if (rotationSize < 2 || interval <= 0) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % rotationSize);
    }, interval);
    return () => clearInterval(timer);
  }, [rotationSize, interval]);

  const text =
    value !== undefined
      ? value
      : values && values.length > 0
        ? values[index % values.length]
        : undefined;

  const [swap, setSwap] = useState<{ current: string | undefined; previous: string | undefined }>(
    () => ({ current: text, previous: undefined })
  );

  if (swap.current !== text) {
    setSwap({ current: text, previous: swap.current });
  }

  useEffect(() => {
    if (swap.previous === undefined) return;
    const timer = setTimeout(() => {
      setSwap((state) => ({ ...state, previous: undefined }));
    }, EXIT_MS);
    return () => clearTimeout(timer);
  }, [swap.previous]);

  const variables = {
    ...style,
    ...(duration ? { '--tb-shimmer-duration': duration } : {}),
    ...(angle ? { '--tb-shimmer-angle': angle } : {}),
  } as CSSProperties;

  const shimmer = cx(
    'tb-shimmer',
    reverse && 'tb-shimmer-reverse',
    once && 'tb-shimmer-once',
    !active && 'tb-shimmer-none'
  );

  if (text === undefined) {
    return (
      <Tag {...rest} className={cx(shimmer, className)} style={variables}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag {...rest} className={cx(styles.root, className)} style={variables}>
      {swap.previous === undefined ? null : (
        <span
          key={`previous-${swap.previous}`}
          className={cx(shimmer, styles.layer, styles.previous)}
          data-shimmer-layer="previous"
          aria-hidden="true"
        >
          {swap.previous}
        </span>
      )}
      <span
        key={`current-${text}`}
        className={cx(shimmer, styles.layer, styles.current)}
        data-shimmer-layer="current"
      >
        {text}
      </span>
    </Tag>
  );
}
