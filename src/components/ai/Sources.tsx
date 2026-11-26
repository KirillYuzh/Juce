import { useMemo } from 'react';
import styles from './Sources.module.css';
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from './Trace';
import { Icon } from '../ui/Icon';
import { hostOf, safeHref } from '../../lib/url';

export interface SourceItem {
  url: string;
  title?: string;
}

function plural(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'источник';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'источника';
  return 'источников';
}

export interface SourcesProps {
  sources: SourceItem[];
  defaultOpen?: boolean;
  className?: string;
}

export function Sources({ sources, defaultOpen = false, className }: SourcesProps) {
  const unique = useMemo(() => {
    const seen = new Set<string>();
    return sources.filter((source) => {
      if (seen.has(source.url)) return false;
      seen.add(source.url);
      return true;
    });
  }, [sources]);

  return (
    <Trace className={className}>
      <TraceCollapsible defaultOpen={defaultOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon name="globe" size={16} />
            </TraceIcon>
            <TraceTitle>
              Использовано {unique.length} {plural(unique.length)}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {unique.map((source) => {
              const href = safeHref(source.url);
              const line = (
                <TraceLine>
                  <TraceIcon>
                    <Icon name="globe" size={16} />
                  </TraceIcon>
                  <TraceTitle className={styles.title}>
                    {source.title ?? hostOf(source.url)}
                    {href && (
                      <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
                    )}
                  </TraceTitle>
                  {href && (
                    <TraceIcon className={styles.external}>
                      <Icon name="arrowUpRight" size={14} />
                    </TraceIcon>
                  )}
                </TraceLine>
              );

              return href ? (
                <a
                  className={styles.link}
                  key={source.url}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {line}
                </a>
              ) : (
                <div className={styles.link} key={source.url}>
                  {line}
                </div>
              );
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
