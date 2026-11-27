import {
  cloneElement,
  isValidElement,
  useId,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import styles from './Feedback.module.css';
import { Button } from './Button';
import { cx } from '../../lib/cx';

export function Tooltip({ text, children }: { text: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger =
    isValidElement(children) && typeof children.type !== 'symbol'
      ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
          'aria-describedby': id,
        })
      : children;

  const handleBlur = (event: React.FocusEvent<HTMLSpanElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node && event.currentTarget.contains(next))) setOpen(false);
  };

  return (
    <span
      className={styles.tooltipWrap}
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      {trigger}
      <span id={id} className={styles.tooltip} role="tooltip" aria-hidden={open ? undefined : true}>
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
    <div
      className={cx(styles.cookie, className)}
      role="region"
      aria-live="polite"
      aria-label="Использование куки"
    >
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
