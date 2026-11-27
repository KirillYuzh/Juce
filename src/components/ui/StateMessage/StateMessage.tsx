import type { ReactNode } from 'react';
import styles from './StateMessage.module.css';
import { Icon } from '../Icon';
import { Stack } from '../Layout';
import { Text } from '../Typography';
import { cx } from '../../../lib/cx';

export type StateMessageTone = 'neutral' | 'error';

export interface StateMessageProps {
  tone?: StateMessageTone;
  icon?: ReactNode;
  title: ReactNode;
  text?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function StateMessage({
  tone = 'neutral',
  icon,
  title,
  text,
  action,
  className,
}: StateMessageProps) {
  return (
    <Stack
      gap="4"
      align="center"
      role={tone === 'error' ? 'alert' : 'status'}
      data-tone={tone}
      className={cx(styles.message, className)}
    >
      <span className={styles.icon}>
        {icon ?? <Icon name={tone === 'error' ? 'alertCircle' : 'info'} size={32} />}
      </span>
      <Stack gap="2" align="center">
        <Text as="p" size="l" weight="medium">
          {title}
        </Text>
        {text ? <Text tone="secondary">{text}</Text> : null}
      </Stack>
      {action ? <div className={styles.action}>{action}</div> : null}
    </Stack>
  );
}
