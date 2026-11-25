import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './Navigation.module.css';
import { Icon } from './Icon';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';
import { cx } from '../../lib/cx';
import { useControllableState } from '../../lib/use-controllable-state';

export interface TabItem {
  id: string;
  label: string;
  content?: ReactNode;
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
  const baseId = useId().replace(/:/g, '');
  const [active, setActive] = useControllableState({
    value,
    defaultValue: defaultValue ?? items[0]?.id ?? '',
    onChange,
  });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (value !== undefined) return;
    if (!items.length) return;
    if (!items.some((item) => item.id === active)) setActive(items[0].id);
  }, [items, value, active, setActive]);

  const activeIndex = items.findIndex((item) => item.id === active);
  const currentIndex = activeIndex >= 0 ? activeIndex : items.length ? 0 : -1;
  const hasPanels = items.some((item) => item.content !== undefined);
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  const selectTab = (index: number) => {
    const item = items[index];
    if (!item) return;
    setActive(item.id);
    tabRefs.current[index]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!items.length) return;
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        selectTab((index + 1) % items.length);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        selectTab((index - 1 + items.length) % items.length);
        break;
      case 'Home':
        event.preventDefault();
        selectTab(0);
        break;
      case 'End':
        event.preventDefault();
        selectTab(items.length - 1);
        break;
    }
  };

  return (
    <>
      <div
        className={cx(styles.tabs, 'tb-scrollbar-hidden', className)}
        role="tablist"
        aria-label={label}
      >
        {items.map((item, index) => {
          const selected = index === currentIndex;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={tabId(index)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={hasPanels ? panelId(index) : undefined}
              tabIndex={selected ? 0 : -1}
              className={cx(styles.tab, selected && styles.tabActive)}
              onClick={() => setActive(item.id)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {hasPanels &&
        items.map((item, index) => (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId(index)}
            aria-labelledby={tabId(index)}
            tabIndex={0}
            hidden={index !== currentIndex}
          >
            {item.content}
          </div>
        ))}
    </>
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
      {items.map((item) => (
        <Collapsible
          key={item.id}
          open={item.id === openId}
          onOpenChange={(open) => setOpenId(open ? item.id : null)}
          keepMounted
          className={styles.accordionItem}
        >
          <CollapsibleTrigger className={styles.accordionButton}>
            {item.title}
            <span className={styles.accordionChevron}>
              <Icon name="chevronDown" size={20} />
            </span>
          </CollapsibleTrigger>
          <CollapsibleContent className={styles.accordionPanel}>
            <div className={styles.accordionPanelInner}>{item.content}</div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
