import type { ReactNode } from 'react';
import styles from './Button.module.css';
import { Icon, type IconName } from './Icon';

// Buttons keep the source's 12px radius and 56/44/32 heights.

export type ButtonVariant = 'primary' | 'secondary' | 'white' | 'outline' | 'ghost' | 'dark';
export type ButtonSize = 's' | 'm' | 'l';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
  href?: string;
}

export function Button({
  variant = 'primary',
  size = 'l',
  fullWidth,
  loading,
  iconLeft,
  iconRight,
  children,
  className,
  href,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = cx(
    styles.button,
    styles[`size-${size}`],
    styles[variant],
    fullWidth && styles.fullWidth,
    className
  );
  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {!loading && iconLeft && (
        <span className={styles.icon}>
          <Icon name={iconLeft} size={size === 's' ? 16 : 20} />
        </span>
      )}
      {children}
      {!loading && iconRight && (
        <span className={styles.icon}>
          <Icon name={iconRight} size={size === 's' ? 16 : 20} />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  label: string;
  size?: 'xs' | 's' | 'm';
  variant?: 'neutral' | 'plain' | 'ghost';
}

export function IconButton({
  icon,
  label,
  size = 'm',
  variant = 'neutral',
  className,
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cx(
        styles.iconButton,
        styles[`iconButtonSize-${size}`],
        variant === 'plain' && styles.iconButtonPlain,
        variant === 'ghost' && styles.iconButtonGhost,
        className
      )}
      {...rest}
    >
      <Icon name={icon} size={size === 'xs' ? 16 : size === 's' ? 20 : 24} />
    </button>
  );
}

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  arrow?: boolean;
  children: ReactNode;
}

export function TextLink({ arrow, children, className, ...rest }: TextLinkProps) {
  return (
    <a className={cx(styles.link, arrow && styles.linkArrow, className)} {...rest}>
      {children}
      {arrow && <Icon name="arrowRight" size={16} />}
    </a>
  );
}
