import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useThemeTokens } from '../../../lib/use-theme-tokens';
import { ThemeProvider, useTheme } from './ThemeProvider';

function Consumer() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <span data-testid="current">{theme}</span>
      <button type="button" onClick={() => setTheme('ocean')}>
        Океан
      </button>
    </div>
  );
}

function AccentProbe() {
  const { accent } = useThemeTokens(null);

  return <span data-testid="accent">{accent}</span>;
}

// jsdom не резолвит var(): читаем --tb-* с корня документа сами.
function stubThemeTokens() {
  return vi.spyOn(globalThis, 'getComputedStyle').mockImplementation((element: Element) => {
    return {
      get color() {
        const declared = (element as HTMLElement).style.color;
        const role = /var\((--tb-\w+)\)/.exec(declared)?.[1];
        return role ? document.documentElement.style.getPropertyValue(role) : 'rgb(0, 0, 0)';
      },
      get colorScheme() {
        return '';
      },
    } as unknown as CSSStyleDeclaration;
  });
}

afterEach(() => {
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty('--tb-accent');
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('ThemeProvider', () => {
  it('sets the theme on the document root', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <span />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('updates the document theme and reports the new theme', () => {
    const onChange = vi.fn();

    render(
      <ThemeProvider defaultTheme="dark" onThemeChange={onChange}>
        <Consumer />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Океан' }));

    expect(document.documentElement.dataset.theme).toBe('ocean');
    expect(screen.getByTestId('current').textContent).toBe('ocean');
    expect(onChange).toHaveBeenCalledWith('ocean');
  });

  it('reads the initial theme from storage and persists changes', () => {
    window.localStorage.setItem('juce-theme', 'dusk');

    render(
      <ThemeProvider storageKey="juce-theme">
        <Consumer />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('dusk');

    fireEvent.click(screen.getByRole('button', { name: 'Океан' }));

    expect(document.documentElement.dataset.theme).toBe('ocean');
    expect(window.localStorage.getItem('juce-theme')).toBe('ocean');
  });

  it('lets a controlled theme win over storage and the default', () => {
    window.localStorage.setItem('juce-theme', 'dusk');

    render(
      <ThemeProvider theme="heroui" defaultTheme="dark" storageKey="juce-theme">
        <span />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('heroui');
  });

  it('prefers a stored theme over defaultTheme', () => {
    window.localStorage.setItem('juce-theme', 'dusk');

    render(
      <ThemeProvider defaultTheme="dark" storageKey="juce-theme">
        <span />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('dusk');
    expect(window.localStorage.getItem('juce-theme')).toBe('dusk');
  });

  it('leaves storage untouched while the theme is controlled', () => {
    window.localStorage.setItem('juce-theme', 'dusk');

    render(
      <ThemeProvider theme="heroui" defaultTheme="dark" storageKey="juce-theme">
        <span />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('heroui');
    expect(window.localStorage.getItem('juce-theme')).toBe('dusk');
  });

  it('applies a theme written to storage by another tab', () => {
    render(
      <ThemeProvider storageKey="juce-theme">
        <Consumer />
      </ThemeProvider>
    );

    expect(document.documentElement.dataset.theme).toBe('light');

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'juce-theme', newValue: 'silk' }));
    });

    expect(document.documentElement.dataset.theme).toBe('silk');
    expect(screen.getByTestId('current').textContent).toBe('silk');
  });

  it('ignores storage events for other keys and unknown themes', () => {
    render(
      <ThemeProvider storageKey="juce-theme">
        <Consumer />
      </ThemeProvider>
    );

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'other', newValue: 'ocean' }));
      window.dispatchEvent(new StorageEvent('storage', { key: 'juce-theme', newValue: 'missing' }));
    });

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('stops listening to storage after unmount', () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <ThemeProvider storageKey="juce-theme" onThemeChange={onChange}>
        <Consumer />
      </ThemeProvider>
    );
    unmount();

    act(() => {
      window.dispatchEvent(new StorageEvent('storage', { key: 'juce-theme', newValue: 'silk' }));
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('tracks an accent written to the root inline style', async () => {
    document.documentElement.style.setProperty('--tb-accent', '#112233');
    stubThemeTokens();

    const { unmount } = render(<AccentProbe />);

    await waitFor(() => expect(screen.getByTestId('accent').textContent).toBe('#112233'));

    act(() => {
      document.documentElement.style.setProperty('--tb-accent', '#445566');
    });

    await waitFor(() => expect(screen.getByTestId('accent').textContent).toBe('#445566'));

    unmount();
    document.documentElement.style.removeProperty('--tb-accent');
  });
});
