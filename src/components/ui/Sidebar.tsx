import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import styles from './Sidebar.module.css';
import { Icon } from './Icon';
import { IconButton } from './Button';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3.25rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  state: 'expanded' | 'collapsed';
  toggleSidebar: () => void;
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
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const open = openProp ?? innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

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
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT) return;
      if (!event.metaKey && !event.ctrlKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
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
      toggleSidebar,
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
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
  const { state, openMobile, setOpenMobile, isMobile } = useSidebar();
  const titleId = useId();

  const dataState = isMobile && openMobile ? 'expanded' : state;

  return (
    <>
      {isMobile && openMobile && (
        <div
          className={styles.backdrop}
          onClick={() => setOpenMobile(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cx(styles.sidebar, className)}
        data-state={dataState}
        data-side={side}
        data-variant={variant}
        data-collapsible={collapsible}
        data-mobile={isMobile || undefined}
        aria-labelledby={titleId}
      >
        <span id={titleId} className={styles.srOnly}>
          Боковая панель
        </span>
        {children}
      </aside>
    </>
  );
}

export function SidebarTrigger({ label = 'Переключить панель', className }: { label?: string; className?: string }) {
  const { toggleSidebar, state } = useSidebar();
  return (
    <IconButton
      icon="menu"
      label={label}
      variant="plain"
      className={cx(styles.trigger, className)}
      aria-expanded={state === 'expanded'}
      onClick={toggleSidebar}
    />
  );
}

export function SidebarInset({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cx(styles.inset, className)}>{children}</main>;
}

export function SidebarHeader({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx(styles.header, className)}>{children}</div>;
}

export function SidebarFooter({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx(styles.footer, className)}>{children}</div>;
}

export function SidebarContent({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx(styles.content, className)}>{children}</div>;
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <hr className={cx(styles.separator, className)} />;
}

export function SidebarGroup({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx(styles.group, className)}>{children}</div>;
}

export function SidebarGroupLabel({ children, className }: { children?: ReactNode; className?: string }) {
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

export function SidebarGroupContent({ children, className }: { children?: ReactNode; className?: string }) {
  return <div className={cx(styles.groupContent, className)}>{children}</div>;
}

export function SidebarMenu({ children, className }: { children?: ReactNode; className?: string }) {
  return <ul className={cx(styles.menu, className)}>{children}</ul>;
}

export function SidebarMenuItem({ children, className }: { children?: ReactNode; className?: string }) {
  return <li className={cx(styles.menuItem, className)}>{children}</li>;
}

export interface SidebarMenuButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  isActive?: boolean;
  href?: string;
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
      <a className={classes} href={href} data-active={isActive || undefined} aria-current={isActive || undefined}>
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

export function SidebarMenuBadge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx(styles.menuBadge, className)}>{children}</span>;
}

export function SidebarMenuSub({ children, className }: { children?: ReactNode; className?: string }) {
  return <ul className={cx(styles.menuSub, className)}>{children}</ul>;
}

export function SidebarMenuSubItem({ children, className }: { children?: ReactNode; className?: string }) {
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
      <a className={classes} href={href} data-active={isActive || undefined} aria-current={isActive || undefined}>
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
      <span className={styles.skeletonIcon} />
      <span className={styles.skeletonText} />
    </span>
  );
}

export function SidebarRail({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      className={cx(styles.rail, className)}
      aria-label="Свернуть панель"
      onClick={toggleSidebar}
    />
  );
}

/** Small convenience: an icon-based sub-item arrow. */
export function SidebarMenuChevron() {
  return <Icon name="chevronDown" size={16} className={styles.chevron} />;
}
