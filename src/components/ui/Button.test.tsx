import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('делает недоступную ссылку некликабельной', () => {
    const onClick = vi.fn();
    render(
      <Button href="/go" disabled onClick={onClick}>
        Открыть
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Открыть' });

    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(link.getAttribute('tabindex')).toBe('-1');

    const allowed = fireEvent.click(link);

    expect(allowed).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('не пускает опасный href в ссылку', () => {
    const onClick = vi.fn();
    render(
      <Button href="javascript:alert(1)" onClick={onClick}>
        Открыть
      </Button>
    );
    const label = screen.getByText('Открыть');
    const link = label.closest('a');

    expect(link).not.toBeNull();
    expect(link?.getAttribute('href')).toBeNull();
    expect(link?.getAttribute('aria-disabled')).toBe('true');
    expect(fireEvent.click(label)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('сохраняет относительную ссылку', () => {
    render(<Button href="/docs">Документация</Button>);

    expect(screen.getByRole('link', { name: 'Документация' }).getAttribute('href')).toBe('/docs');
  });

  it('оставляет рабочую ссылку кликабельной', () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Button href="/go" onClick={onClick}>
        Открыть
      </Button>
    );

    fireEvent.click(screen.getByRole('link', { name: 'Открыть' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
