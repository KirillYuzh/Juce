import { useState, type ReactNode } from 'react';
import styles from './Navigation.module.css';
import { Icon } from './Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  className?: string;
  label?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  className,
  label = 'Разделы',
}: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.id);
  const active = value ?? inner;
  return (
    <div
      className={cx(styles.tabs, 'tb-scrollbar-hidden', className)}
      role="tablist"
      aria-label={label}
    >
      {items.map((item) => {
        const selected = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cx(styles.tab, selected && styles.tabActive)}
            onClick={() => {
              setInner(item.id);
              onChange?.(item.id);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);
  return (
    <div className={cx(styles.accordion, className)}>
      {items.map((item) => {
        const open = item.id === openId;
        return (
          <div key={item.id} className={cx(styles.accordionItem, open && styles.accordionOpen)}>
            <button
              type="button"
              className={styles.accordionButton}
              aria-expanded={open}
              aria-controls={`panel-${item.id}`}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              {item.title}
              <span className={styles.accordionChevron}>
                <Icon name="chevronDown" size={20} />
              </span>
            </button>
            <div className={styles.accordionPanel} id={`panel-${item.id}`} hidden={!open}>
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
