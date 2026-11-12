import type { ReactNode } from 'react';
import styles from './Suggestion.module.css';
import { Button } from '../ui/Button';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export function Suggestions({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(styles.row, 'tb-scroll-fade-x', className)}>{children}</div>;
}

export function Suggestion({
  children,
  onClick,
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="s"
      className={cx(styles.suggestion, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
