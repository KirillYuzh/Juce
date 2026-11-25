import type { ReactNode } from 'react';
import styles from './Button.module.css';
import { Icon, type IconName } from './Icon';
import { cx } from '../../lib/cx';

export type ButtonVariant =
  'primary' | 'secondary' | 'white' | 'outline' | 'neutral' | 'ghost' | 'dark' | 'danger';
export type ButtonSize = 's' | 'm' | 'l';

export interface ButtonProps extends Omit<React.ComponentPropsWithRef<'button'>, 'children'> {
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
  ref,
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
      {loading && <span className={cx(styles.spinner, 'tb-motion-essential')} aria-hidden="true" />}
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

  const unavailable = Boolean(disabled || loading);

  if (href) {
    const anchorRest = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        {...anchorRest}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        href={href}
        aria-disabled={unavailable || undefined}
        tabIndex={unavailable ? -1 : anchorRest.tabIndex}
        onClick={(event) => {
          if (unavailable) {
            event.preventDefault();
            return;
          }
          anchorRest.onClick?.(event);
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} className={classes} type={type} disabled={unavailable} {...rest}>
      {content}
    </button>
  );
}

export interface IconButtonProps extends React.ComponentPropsWithRef<'button'> {
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
  ref,
  ...rest
}: IconButtonProps) {
  return (
    <button
      ref={ref}
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
