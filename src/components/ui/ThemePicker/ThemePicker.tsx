import type { ReactNode } from 'react';
import styles from './ThemePicker.module.css';
import { cx } from '../../../lib/cx';
import { useTheme } from '../ThemeProvider';

export interface ThemePickerProps {
  variant?: 'named' | 'dots';
  label?: ReactNode;
  className?: string;
}

export function ThemePicker({ variant = 'named', label = 'Тема', className }: ThemePickerProps) {
  const { theme, setTheme, themes } = useTheme();
  const named = variant === 'named';
  const groupLabel = typeof label === 'string' ? label : 'Тема';

  return (
    <div className={cx(styles.root, !named && styles.dots, className)}>
      {named ? <span className={styles.label}>{label}</span> : null}
      <div role="group" aria-label={groupLabel} className={styles.row}>
        {themes.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={item.value === theme}
            aria-label={item.title}
            title={item.title}
            className={styles.option}
            onClick={() => setTheme(item.value)}
          >
            <span className={styles.dot}>
              <span className={styles.fill} data-theme={item.value} />
            </span>
            {named ? <span className={styles.title}>{item.title}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
