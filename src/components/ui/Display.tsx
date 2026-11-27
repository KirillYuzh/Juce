import type { ReactNode } from 'react';
import styles from './Display.module.css';
import { cx } from '../../lib/cx';
import { clamp } from '../../lib/clamp';
import { radiusStyle, type RadiusValue } from '../../lib/radius';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'error' | 'warning';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cx(styles.badge, styles[`badge${tone.charAt(0).toUpperCase()}${tone.slice(1)}`])}
    >
      {children}
    </span>
  );
}

export type ChipVariant = 'solid' | 'outline';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: 'light' | 'dark';
  variant?: ChipVariant;
  children: ReactNode;
}

export function Chip({
  active,
  tone = 'light',
  variant = 'solid',
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <button
      type="button"
      className={cx(
        styles.chip,
        tone === 'dark' && styles.chipDark,
        variant === 'outline' && styles.chipOutline,
        active && styles.chipActive,
        className
      )}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 's' | 'm' | 'l';
  className?: string;
}

export function Avatar({ src, alt = '', initials, size = 'm', className }: AvatarProps) {
  if (src) {
    return (
      <img className={cx(styles.avatar, styles[`avatar-${size}`], className)} src={src} alt={alt} />
    );
  }
  return (
    <span
      className={cx(styles.avatar, styles[`avatar-${size}`], className)}
      role={alt || initials ? 'img' : undefined}
      aria-label={alt || initials || undefined}
      aria-hidden={alt || initials ? undefined : true}
    >
      {initials}
    </span>
  );
}

export function Progress({
  value,
  tone = 'accent',
  label,
}: {
  value: number;
  tone?: 'accent' | 'brand';
  label?: string;
}) {
  const clamped = clamp(value, 0, 100);
  return (
    <div
      className={cx(styles.progress, tone === 'brand' && styles.progressAccent)}
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={styles.progressBar} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function Spinner({ size = 24 }: { size?: number }) {
  return (
    <span
      className={cx(styles.spinner, 'tb-motion-essential')}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 10)) }}
      role="status"
      aria-label="Загрузка"
    />
  );
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius,
  className,
}: {
  width?: number | string;
  height?: number | string;
  radius?: RadiusValue;
  className?: string;
}) {
  return (
    <span
      className={cx(styles.skeleton, 'tb-motion-decorative', className)}
      style={radiusStyle(radius, { display: 'block', width, height })}
    />
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cx(styles.divider, className)} />;
}

export function Logo({ className, label = 'Джус' }: { className?: string; label?: string }) {
  return (
    <span className={cx(styles.logo, className)}>
      <span className={styles.logoWord}>{label}</span>
    </span>
  );
}
