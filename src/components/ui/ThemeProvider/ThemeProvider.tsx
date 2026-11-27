import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { THEMES, type ThemeName } from '../../../styles/themes';
import { useControllableState } from '../../../lib/use-controllable-state';

export interface ThemeProviderProps {
  theme?: ThemeName;
  defaultTheme?: ThemeName;
  onThemeChange?: (theme: ThemeName) => void;
  storageKey?: string;
  children: ReactNode;
}

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: typeof THEMES;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isThemeName(value: string | null): value is ThemeName {
  return value !== null && THEMES.some((theme) => theme.value === value);
}

function readStoredTheme(storageKey: string | undefined): ThemeName | undefined {
  if (!storageKey || typeof window === 'undefined') return undefined;

  try {
    const stored = window.localStorage.getItem(storageKey);
    return isThemeName(stored) ? stored : undefined;
  } catch {
    return undefined;
  }
}

function writeStoredTheme(storageKey: string | undefined, theme: ThemeName) {
  if (!storageKey || typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(storageKey, theme);
  } catch {
    /* Storage can be unavailable; the page theme still applies. */
  }
}

export function ThemeProvider({
  theme: controlledTheme,
  defaultTheme,
  onThemeChange,
  storageKey,
  children,
}: ThemeProviderProps) {
  const [initialTheme] = useState<ThemeName>(
    () => controlledTheme ?? readStoredTheme(storageKey) ?? defaultTheme ?? 'light'
  );
  const [theme, setTheme] = useControllableState<ThemeName>({
    value: controlledTheme,
    defaultValue: initialTheme,
    onChange: onThemeChange,
  });
  const controlled = controlledTheme !== undefined;

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (controlled) return;
    writeStoredTheme(storageKey, theme);
  }, [controlled, storageKey, theme]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;

    const syncFromStorage = (event: StorageEvent) => {
      if (event.key !== storageKey || !isThemeName(event.newValue)) return;
      setTheme(event.newValue);
    };

    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, [storageKey, setTheme]);

  const value = useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error('useTheme must be used inside a ThemeProvider');
  }

  return value;
}
