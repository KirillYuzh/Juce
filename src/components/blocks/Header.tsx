import { useEffect, useId, useRef, useState } from 'react';
import styles from './Header.module.css';
import { Logo } from '../ui/Display';
import { Icon } from '../ui/Icon';
import { Button, IconButton } from '../ui/Button';
import type { NavItem } from '../../data/home';
import { cx } from '../../lib/cx';

export interface HeaderProps {
  nav: NavItem[];
  loginLabel?: string;
  loginHref?: string;
  homeHref?: string;
  brand?: string;
  onSearch?: () => void;
  className?: string;
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipFocusOpen = useRef(false);
  const focusFirstOnOpen = useRef(false);
  const panelId = `nav-panel-${useId().replace(/:/g, '')}`;
  const hasChildren = Boolean(item.children);

  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
  }, [open]);

  const openPanel = () => {
    focusFirstOnOpen.current = true;
    setOpen(true);
  };

  return (
    <div
      className={styles.navItem}
      onFocus={() => {
        if (skipFocusOpen.current) {
          skipFocusOpen.current = false;
          return;
        }
        if (hasChildren) setOpen(true);
      }}
      onBlur={(event) => {
        if (!hasChildren) return;
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }
        setOpen(false);
      }}
      onPointerEnter={() => {
        if (hasChildren) setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (!hasChildren) return;
        if (event.currentTarget.contains(document.activeElement)) return;
        setOpen(false);
      }}
      onKeyDown={(event) => {
        if (!hasChildren) return;
        if (event.key === 'Escape') {
          event.preventDefault();
          setOpen(false);
          if (document.activeElement !== triggerRef.current) {
            skipFocusOpen.current = true;
            triggerRef.current?.focus();
          }
          return;
        }
        if (event.target !== triggerRef.current) return;
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
          event.preventDefault();
          openPanel();
        }
      }}
    >
      <a
        ref={triggerRef}
        className={styles.navLink}
        href={item.href}
        aria-expanded={hasChildren ? open : undefined}
        aria-controls={hasChildren ? panelId : undefined}
      >
        {item.title}
      </a>
      {item.children && open && (
        <div className={styles.dropdown} id={panelId} ref={panelRef}>
          {item.children.map((child) => (
            <a className={styles.dropdownLink} key={child.title} href={child.href}>
              {child.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header({
  nav,
  loginLabel,
  loginHref = '#',
  homeHref = '#',
  brand = 'Джус',
  onSearch,
  className,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = `mobile-menu-${useId().replace(/:/g, '')}`;
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      menuRef.current?.querySelector<HTMLElement>('a[href], button')?.focus();
    } else if (wasOpen.current) {
      burgerRef.current?.focus();
    }
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const label = loginLabel ?? 'Личный кабинет';

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled, className)}>
      <div className={cx('tb-container', styles.inner)}>
        <a className={styles.logo} href={homeHref} aria-label={brand}>
          <Logo label={brand} />
        </a>

        <nav className={styles.nav} aria-label="Основное меню">
          {nav.map((item) => (
            <DesktopNavItem item={item} key={item.title} />
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.desktopActions}>
            {onSearch && (
              <IconButton icon="search" label="Поиск" variant="plain" onClick={onSearch} />
            )}
            <a className={styles.login} href={loginHref}>
              <Icon name="user" size={24} />
              {label}
            </a>
          </div>

          <div className={styles.mobileActions}>
            <Button variant="secondary" size="m" href={loginHref}>
              {label}
            </Button>
            {onSearch && <IconButton icon="search" label="Поиск" size="s" onClick={onSearch} />}
            <IconButton
              ref={burgerRef}
              icon={menuOpen ? 'close' : 'menu'}
              label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              size="s"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu} id={menuId} ref={menuRef}>
          <div className="tb-container">
            <nav aria-label="Мобильное меню">
              {nav.map((item) => (
                <div key={item.title}>
                  <a
                    className={styles.mobileNavLink}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                  {item.children && (
                    <ul aria-label={`Подразделы: ${item.title}`}>
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <a
                            className={styles.mobileNavLink}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                          >
                            {child.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
            <div className={styles.mobileMenuFooter}>
              <Button variant="primary" size="m" href={loginHref} fullWidth>
                {label}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
