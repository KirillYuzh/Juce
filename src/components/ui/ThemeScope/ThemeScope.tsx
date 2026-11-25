import type { CSSProperties, ReactNode } from 'react';
import styles from './ThemeScope.module.css';
import { cx } from '../../../lib/cx';
import type { ThemeName } from '../../../styles/themes';

export type ThemeScopeProps = {
  theme?: ThemeName;
  as?: 'div' | 'section' | 'article' | 'main';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

export function ThemeScope({
  theme = 'light',
  as: Tag = 'div',
  className,
  style,
  children,
}: ThemeScopeProps) {
  return (
    <Tag className={cx(styles.scope, className)} data-theme={theme} style={style}>
      {children}
    </Tag>
  );
}
