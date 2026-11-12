import type { ReactNode } from 'react';
import styles from './Display.module.css';
import { Icon, type IconName } from './Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'error' | 'warning';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={cx(styles.badge, styles[`badge${tone[0].toUpperCase()}${tone.slice(1)}`])}>
      {children}
    </span>
  );
}

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: 'light' | 'dark';
  children: ReactNode;
}

export function Chip({ active, tone = 'light', className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={cx(
        styles.chip,
        tone === 'dark' && styles.chipDark,
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
      aria-label={alt || initials}
    >
      {initials}
    </span>
  );
}

export function Progress({ value, tone = 'accent' }: { value: number; tone?: 'accent' | 'brand' }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cx(styles.progress, tone === 'brand' && styles.progressAccent)}
      role="progressbar"
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
      className={styles.spinner}
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
  radius?: number;
  className?: string;
}) {
  return (
    <span
      className={cx(styles.skeleton, className)}
      style={{ display: 'block', width, height, borderRadius: radius }}
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

export function IconTile({ icon, size = 36 }: { icon: IconName; size?: number }) {
  return <Icon name={icon} size={size} />;
}
