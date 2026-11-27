import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import styles from './Sidebar.module.css';
import { IconButton } from './Button';
import { Skeleton } from './Display';
import { cx } from '../../lib/cx';
import { FOCUSABLE } from '../../lib/focus';
import { useControllableState } from '../../lib/use-controllable-state';

export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3.25rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  state: 'expanded' | 'collapsed';
  sidebarId: string;
  toggleSidebar: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used inside <SidebarProvider>');
  return context;
}

export interface SidebarProviderProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
}: SidebarProviderProps) {
  const [open, setOpen] = useControllableState({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasMobileOpen = useRef(false);
  const sidebarId = useId();

  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((current) => !current);
    else setOpen(!open);
  }, [isMobile, open, setOpen]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (openMobile) {
      wasMobileOpen.current = true;
      return;
    }
    if (wasMobileOpen.current) {
      wasMobileOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [openMobile]);

  useEffect(() => {
    if (!openMobile) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpenMobile(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openMobile]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT) return;
      if (!event.metaKey && !event.ctrlKey) return;
      if (event.altKey || event.shiftKey) return;
      const target = event.target;
      const root = rootRef.current;
      if (!(target instanceof Node) || !root?.contains(target)) return;
      if (
        target instanceof Element &&
        target.closest('input, textarea, select, [contenteditable="true"]')
      ) {
        return;
      }
      event.preventDefault();
      toggleSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleSidebar]);

  const value = useMemo<SidebarContextValue>(
    () => ({
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      state: open ? 'expanded' : 'collapsed',
      sidebarId,
      toggleSidebar,
      triggerRef,
    }),
    [open, setOpen, openMobile, isMobile, sidebarId, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        ref={rootRef}
        className={cx(styles.provider, className)}
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-mobile': SIDEBAR_WIDTH_MOBILE,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps {
  children: ReactNode;
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
  className?: string;
}

export function Sidebar({
  children,
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
}: SidebarProps) {
  const { state, openMobile, setOpenMobile, isMobile, sidebarId } = useSidebar();
  const titleId = useId();
  const asideRef = useRef<HTMLElement>(null);

  const dataState = isMobile ? (openMobile ? 'expanded' : 'collapsed') : state;
  const closed = isMobile ? !openMobile : collapsible === 'offcanvas' && state === 'collapsed';

  useEffect(() => {
    if (!isMobile || !openMobile) return;
    const first = asideRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
  }, [isMobile, openMobile]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!isMobile || !openMobile || event.key !== 'Tab') return;
    const focusable = Array.from(asideRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {isMobile && openMobile && (
        <div className={styles.backdrop} onClick={() => setOpenMobile(false)} aria-hidden="true" />
      )}
      <aside
        ref={asideRef}
        id={sidebarId}
        className={cx(styles.sidebar, className)}
        data-state={dataState}
        data-side={side}
        data-variant={variant}
        data-collapsible={collapsible}
        data-mobile={isMobile || undefined}
        aria-labelledby={titleId}
        aria-hidden={closed || undefined}
        inert={closed || undefined}
        onKeyDown={onKeyDown}
      >
        <span id={titleId} className={styles.srOnly}>
          Боковая панель
        </span>
        {children}
      </aside>
    </>
  );
}

export function SidebarTrigger({
  label = 'Переключить панель',
  className,
}: {
  label?: string;
  className?: string;
}) {
  const { toggleSidebar, state, isMobile, openMobile, triggerRef } = useSidebar();
  const expanded = isMobile ? openMobile : state === 'expanded';
  return (
    <IconButton
      ref={triggerRef}
      icon="menu"
      label={label}
      variant="plain"
      className={cx(styles.trigger, className)}
      aria-expanded={expanded}
      onClick={toggleSidebar}
    />
  );
}

export function SidebarInset({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cx(styles.inset, className)}>{children}</main>;
}

export function SidebarHeader({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.header, className)}>{children}</div>;
}

export function SidebarFooter({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}

export function SidebarContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <hr className={cx(styles.separator, className)} />;
}

export function SidebarGroup({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.group, className)}>{children}</div>;
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.groupLabel, className)}>{children}</div>;
}

export function SidebarGroupAction({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx(styles.groupAction, className)} {...rest}>
      {children}
    </button>
  );
}

export function SidebarGroupContent({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <div className={cx(styles.groupContent, className)}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children?: ReactNode; className?: string }) {
  return <ul className={cx(styles.menu, className)}>{children}</ul>;
}

export function SidebarMenuItem({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <li className={cx(styles.menuItem, className)}>{children}</li>;
}

export interface SidebarMenuButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    Pick<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      'href' | 'target' | 'rel' | 'download' | 'referrerPolicy' | 'hrefLang'
    > {
  children: ReactNode;
  isActive?: boolean;
  icon?: ReactNode;
}

export function SidebarMenuButton({
  children,
  isActive,
  href,
  icon,
  className,
  ...rest
}: SidebarMenuButtonProps) {
  const classes = cx(styles.menuButton, className);
  const content = (
    <>
      {icon && (
        <span className={styles.menuIcon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.menuLabel}>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        href={href}
        data-active={isActive || undefined}
        aria-current={isActive || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} data-active={isActive || undefined} {...rest}>
      {content}
    </button>
  );
}

export function SidebarMenuAction({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx(styles.menuAction, className)} {...rest}>
      {children}
    </button>
  );
}

export function SidebarMenuBadge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(styles.menuBadge, className)}>{children}</span>;
}

export function SidebarMenuSub({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <ul className={cx(styles.menuSub, className)}>{children}</ul>;
}

export function SidebarMenuSubItem({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <li className={cx(styles.menuSubItem, className)}>{children}</li>;
}

export function SidebarMenuSubButton({
  children,
  isActive,
  href,
  className,
  ...rest
}: SidebarMenuButtonProps) {
  const classes = cx(styles.menuSubButton, className);
  if (href) {
    return (
      <a
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        href={href}
        data-active={isActive || undefined}
        aria-current={isActive || undefined}
      >
        <span className={styles.menuLabel}>{children}</span>
      </a>
    );
  }
  return (
    <button type="button" className={classes} data-active={isActive || undefined} {...rest}>
      <span className={styles.menuLabel}>{children}</span>
    </button>
  );
}

export function SidebarMenuSkeleton({ className }: { className?: string }) {
  return (
    <span className={cx(styles.skeleton, className)} aria-hidden="true">
      <Skeleton className={styles.skeletonIcon} width={20} height={20} radius="xxs" />
      <Skeleton className={styles.skeletonText} width="60%" height={14} radius="xs" />
    </span>
  );
}

export function SidebarMenuSubSkeleton({ className }: { className?: string }) {
  return (
    <span className={cx(styles.subSkeleton, className)} aria-hidden="true">
      <Skeleton width="45%" height={12} radius="xxs" />
    </span>
  );
}

export function SidebarRail({ className }: { className?: string }) {
  const { toggleSidebar, state, sidebarId } = useSidebar();
  const expanded = state === 'expanded';
  return (
    <button
      type="button"
      className={cx(styles.rail, className)}
      aria-label={expanded ? 'Свернуть панель' : 'Развернуть панель'}
      aria-expanded={expanded}
      aria-controls={sidebarId}
      onClick={toggleSidebar}
    />
  );
}
