import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { Logo } from '../ui/Display';
import { Icon } from '../ui/Icon';
import { Button, IconButton } from '../ui/Button';
import type { NavItem } from '../../data/home';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export interface HeaderProps {
  nav: NavItem[];
  variant?: 'home' | 'researchers';
  loginLabel?: string;
  loginHref?: string;
  homeHref?: string;
  className?: string;
}

export function Header({
  nav,
  variant = 'home',
  loginLabel,
  loginHref = '#',
  homeHref = '#',
  className,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const label = loginLabel ?? (variant === 'researchers' ? 'Войти' : 'Личный кабинет');

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled, className)}>
      <div className={cx('tb-container', styles.inner)}>
        <a
          className={styles.logo}
          href={variant === 'researchers' ? '#/researchers' : homeHref}
          aria-label="Джус"
        >
          <Logo />
        </a>

        <nav className={styles.nav} aria-label="Основное меню">
          {nav.map((item) => (
            <div className={styles.navItem} key={item.title}>
              <a className={styles.navLink} href={item.href}>
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
            {variant === 'researchers' ? (
              <Button variant="secondary" size="l" href={loginHref}>
                {label}
              </Button>
            ) : (
              <>
                <IconButton icon="search" label="Поиск" variant="plain" />
                <a className={styles.login} href={loginHref}>
                  <Icon name="user" size={24} />
                  {label}
                </a>
              </>
            )}
          </div>

          <div className={styles.mobileActions}>
            <Button variant="secondary" size="m" href={loginHref}>
              {label}
            </Button>
            {variant === 'home' && <IconButton icon="search" label="Поиск" size="s" />}
            <IconButton
              icon={menuOpen ? 'close' : 'menu'}
              label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              size="s"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu} id="mobile-menu">
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
