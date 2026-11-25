import { useEffect, useId, useState } from 'react';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
            <div className={styles.navItem} key={item.title}>
              <a
                className={styles.navLink}
                href={item.href}
                aria-haspopup={item.children ? 'menu' : undefined}
              >
                {item.title}
              </a>
              {item.children && (
                <div className={styles.dropdown}>
                  {item.children.map((child) => (
                    <a className={styles.dropdownLink} key={child.title} href={child.href}>
                      {child.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
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
        <div className={styles.mobileMenu} id={menuId}>
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
