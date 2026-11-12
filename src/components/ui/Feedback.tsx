import { useState, type ReactNode } from 'react';
import styles from './Feedback.module.css';
import { Icon } from './Icon';
import { Button } from './Button';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type AlertTone = 'info' | 'warning' | 'error' | 'success';

export interface AlertProps {
  tone?: AlertTone;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Alert({ tone = 'info', children, action, className }: AlertProps) {
  return (
    <div
      className={cx(
        styles.alert,
        tone !== 'info' && styles[`alert${tone[0].toUpperCase()}${tone.slice(1)}`],
        className
      )}
      role="status"
    >
      <span className={styles.alertIcon}>
        <Icon name="info" size={24} />
      </span>
      <div className={styles.alertContent}>
        <span className={styles.alertText}>{children}</span>
        {action && <span className={styles.alertAction}>{action}</span>}
      </div>
    </div>
  );
}

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className={styles.tooltipWrap}>
      {children}
      <span className={styles.tooltip} role="tooltip">
        {text}
      </span>
    </span>
  );
}

export interface CookieNoticeProps {
  text?: ReactNode;
  actionLabel?: string;
  onAccept?: () => void;
  className?: string;
}

export function CookieNotice({
  text = (
    <>
      Мы используем{' '}
      <a className={styles.cookieLink} href="#">
        куки
      </a>
      , чтобы делать сайт удобным для вас
    </>
  ),
  actionLabel = 'Хорошо',
  onAccept,
  className,
}: CookieNoticeProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className={cx(styles.cookie, className)} role="dialog" aria-label="Использование куки">
      <span className={styles.cookieText}>{text}</span>
      <span className={styles.cookieAction}>
        <Button
          variant="secondary"
          size="m"
          onClick={() => {
            setVisible(false);
            onAccept?.();
          }}
        >
          {actionLabel}
        </Button>
      </span>
    </div>
  );
}
