import type { ReactNode } from 'react';
import styles from './Task.module.css';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';
import { Icon, type IconName } from '../ui/Icon';
import { Spinner } from '../ui/Display';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type TaskStatus = 'running' | 'error' | 'done' | 'pending';

export function statusIcon(status: TaskStatus = 'pending'): ReactNode {
  if (status === 'running') return <Spinner size={14} />;
  if (status === 'error') return <Icon name="alertCircle" size={16} />;
  if (status === 'done') return <Icon name="checkCircle" size={16} />;
  return <Icon name="plus" size={14} />;
}

export interface TaskStep {
  id: string;
  title: string;
  status?: TaskStatus;
  icon?: IconName;
  href?: string;
  file?: string;
}

export interface TaskProps {
  title: string;
  status?: Exclude<TaskStatus, 'pending'>;
  steps?: TaskStep[];
  defaultOpen?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Task({ title, status, steps = [], defaultOpen, children, className }: TaskProps) {
  const running = status === 'running';
  return (
    <div className={styles.task}>
      <Trace className={className}>
        <TraceCollapsible defaultOpen={defaultOpen ?? running} keepMounted>
          <TraceCollapsibleTrigger>
            <TraceLine status={running ? 'running' : status === 'error' ? 'error' : undefined}>
              <TraceIcon>{statusIcon(status ?? 'done')}</TraceIcon>
              <TraceTitle>{title}</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            {children ?? (
              <Trace>
                {steps.map((step) => (
                  <TaskItem key={step.id} step={step} />
                ))}
              </Trace>
            )}
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  );
}

export function TaskItem({ step, className }: { step: TaskStep; className?: string }) {
  const content = (
    <TraceLine className={cx(step.status === 'pending' && styles.pending, className)}>
      <TraceIcon>
        {step.icon ? <Icon name={step.icon} size={16} /> : statusIcon(step.status ?? 'done')}
      </TraceIcon>
      <TraceTitle className={styles.title}>{step.title}</TraceTitle>
      {step.file && <span className={styles.file}>{step.file}</span>}
    </TraceLine>
  );

  if (step.href) {
    return (
      <a className={styles.stepLink} href={step.href}>
        {content}
      </a>
    );
  }

  return content;
}

export function TaskItemFile({ children }: { children: ReactNode }) {
  return <span className={styles.file}>{children}</span>;
}
