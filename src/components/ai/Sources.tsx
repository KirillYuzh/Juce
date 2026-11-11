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

export interface SourceItem {
  url: string;
  title?: string;
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
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
  const unique = sources.filter(
    (source, index, all) => all.findIndex((other) => other.url === source.url) === index,
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
            {unique.map((source) => (
              <a
                className={styles.link}
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceIcon>
                    <Icon name="globe" size={16} />
                  </TraceIcon>
                  <TraceTitle className={styles.title}>
                    {source.title ?? hostOf(source.url)}
                    <span className="tb-visually-hidden"> (открывается в новой вкладке)</span>
                  </TraceTitle>
                  <TraceIcon className={styles.external}>
                    <Icon name="arrowUpRight" size={14} />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  );
}
