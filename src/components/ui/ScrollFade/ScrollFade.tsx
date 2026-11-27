import type { ElementType } from 'react';
import { cx } from '../../../lib/cx';

export type ScrollFadeDirection = 'y' | 'x' | 'both' | 'top' | 'bottom' | 'left' | 'right';

const directionClass: Record<ScrollFadeDirection, string> = {
  y: 'tb-scroll-fade-y',
  x: 'tb-scroll-fade-x',
  both: 'tb-scroll-fade',
  top: 'tb-scroll-fade-t',
  bottom: 'tb-scroll-fade-b',
  left: 'tb-scroll-fade-l',
  right: 'tb-scroll-fade-r',
};

export interface ScrollFadeProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  direction?: ScrollFadeDirection;
}

export function ScrollFade({
  as: Tag = 'div',
  direction = 'y',
  className,
  children,
  ...rest
}: ScrollFadeProps) {
  return (
    <Tag {...rest} className={cx(directionClass[direction], className)}>
      {children}
    </Tag>
  );
}
