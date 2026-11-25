import type { ReactNode } from 'react';
import styles from './ThemeScope.module.css';
import { cx } from '../../../lib/cx';

export type ThemeScopeProps = {
  theme?: string;
  skin?: 'default' | 'blueprint';
  as?: 'div' | 'section' | 'article' | 'main';
  className?: string;
  children?: ReactNode;
};

export function ThemeScope({
  theme = 'light',
  skin = 'default',
  as: Tag = 'div',
  className,
  children,
}: ThemeScopeProps) {
  return (
    <Tag className={cx(styles.scope, className)} data-theme={theme} data-skin={skin}>
      {children}
    </Tag>
  );
}
