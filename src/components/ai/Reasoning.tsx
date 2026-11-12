import { useEffect, useRef, useState } from 'react';
import styles from './Reasoning.module.css';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';
import { Icon } from '../ui/Icon';
import { Spinner } from '../ui/Display';

export interface ReasoningProps {
  text: string;
  isStreaming?: boolean;
  duration?: number | null;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function Reasoning({
  text,
  isStreaming = false,
  duration = null,
  open,
  defaultOpen = true,
  onOpenChange,
  className,
}: ReasoningProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const touched = useRef(false);
  const current = open ?? innerOpen;

  useEffect(() => {
    if (touched.current || open !== undefined) return;
    setInnerOpen(isStreaming);
  }, [isStreaming, open]);

  const change = (next: boolean) => {
    touched.current = true;
    if (open === undefined) setInnerOpen(next);
    onOpenChange?.(next);
  };

  const line = (
    <TraceLine status={isStreaming ? 'running' : undefined}>
      <TraceIcon>
        {isStreaming ? <Spinner size={14} /> : <Icon name="checkCircle" size={16} />}
      </TraceIcon>
      <TraceTitle>
        <span className={isStreaming ? 'tb-shimmer' : undefined}>
          {isStreaming ? 'Думает…' : 'Размышления'}
        </span>
      </TraceTitle>
      {!isStreaming && duration !== null && <TraceDescription>{duration} с</TraceDescription>}
    </TraceLine>
  );

  if (!text.trim()) {
    return <Trace className={className}>{line}</Trace>;
  }

  return (
    <Trace className={className}>
      <TraceCollapsible open={current} onOpenChange={change}>
        <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <div className={styles.text}>{text}</div>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
