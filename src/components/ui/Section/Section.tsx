import { useId, type ReactNode } from 'react';
import styles from './Section.module.css';
import { Stack } from '../Layout';
import { Heading, Text } from '../Typography';
import { cx } from '../../../lib/cx';

export interface SectionProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, actions, children, className }: SectionProps) {
  const titleId = `section-${useId().replace(/:/g, '')}-title`;

  return (
    <Stack
      as="section"
      gap="6"
      aria-labelledby={titleId}
      className={cx(styles.section, className)}
    >
      <Stack gap="2">
        <Stack direction="row" gap="3" align="start" justify="between" wrap>
          <Heading level={2} id={titleId}>
            {title}
          </Heading>
          {actions ? (
            <Stack direction="row" gap="3" wrap>
              {actions}
            </Stack>
          ) : null}
        </Stack>
        {description ? <Text tone="secondary">{description}</Text> : null}
      </Stack>
      {children}
    </Stack>
  );
}
