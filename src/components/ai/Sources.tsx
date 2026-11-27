import type { ReactNode } from 'react';
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
import type { LinkRenderer } from '../../lib/link';

export interface SourceItem {
  url: string;
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  href?: string;
  onOpen?: (source: SourceItem) => void;
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
  linkComponent?: LinkRenderer;
}

export function Sources({
  sources,
  defaultOpen = false,
  className,
  linkComponent: Link,
}: SourcesProps) {
  const unique = sources.filter(
    (source, index, all) => all.findIndex((other) => other.url === source.url) === index
  );

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
              const target = source.href ?? safeHref(source.url);
              const onOpen = source.onOpen;
              const external = source.href === undefined && onOpen === undefined;
              const line = (
                <TraceLine>
                  <TraceIcon>{source.icon ?? <Icon name="globe" size={16} />}</TraceIcon>
                  <span className={styles.text}>
                    <TraceTitle className={styles.title}>
                      {source.title ?? hostOf(source.url)}
                      {external && target && (
                        <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
                      )}
                    </TraceTitle>
                    {source.description !== undefined && (
                      <span className={styles.description}>{source.description}</span>
                    )}
                  </span>
                  {external && target && (
                    <TraceIcon className={styles.external}>
                      <Icon name="arrowUpRight" size={14} />
                    </TraceIcon>
                  )}
                </TraceLine>
              );

              if (onOpen) {
                return (
                  <button
                    type="button"
                    className={styles.link}
                    key={source.url}
                    onClick={() => onOpen(source)}
                  >
                    {line}
                  </button>
                );
              }

              if (!target) {
                return (
                  <div className={styles.link} key={source.url}>
                    {line}
                  </div>
                );
              }

              if (Link) {
                return (
                  <Link
                    className={styles.link}
                    key={source.url}
                    href={target}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                  >
                    {line}
                  </Link>
                );
              }

              return (
                <a
                  className={styles.link}
                  key={source.url}
                  href={target}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noreferrer' : undefined}
                >
                  {line}
                </a>
              );
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
