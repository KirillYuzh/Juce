import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Image } from './Image';
import { Card, CardMedia } from '../Card';

describe('Image', () => {
  it('renders the fallback when src is missing', () => {
    const { container } = render(<Image alt="" fallback={<span>Нет изображения</span>} />);

    expect(screen.getByText('Нет изображения')).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[data-slot="image"]')?.getAttribute('data-state')).toBe(
      'error'
    );
  });

  it('renders the fallback when the image fails to load', () => {
    const onError = vi.fn();
    const { container } = render(
      <Image src="/broken.png" alt="" fallback={<span>Ошибка загрузки</span>} onError={onError} />
    );

    fireEvent.error(container.querySelector('img')!);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Ошибка загрузки')).toBeTruthy();
    expect(container.querySelector('img')).toBeNull();
  });

  it('keeps the alt text as an accessible name after an error', () => {
    const { container } = render(<Image src="/broken.png" alt="Обложка" fallback={<span />} />);

    fireEvent.error(container.querySelector('img')!);

    expect(screen.getByRole('img', { name: 'Обложка' })).toBeTruthy();
  });

  it('retries when src changes after an error', () => {
    const { container, rerender } = render(
      <Image src="/broken.png" alt="" fallback={<span>Ошибка загрузки</span>} />
    );
    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();

    rerender(<Image src="/cover.png" alt="" fallback={<span>Ошибка загрузки</span>} />);

    const img = container.querySelector('img');
    expect(img?.getAttribute('src')).toBe('/cover.png');
    expect(container.querySelector('[data-slot="image"]')?.getAttribute('data-state')).toBe(
      'loading'
    );
  });

  it('passes alt, loading and decoding to the img', () => {
    render(<Image src="/cover.png" alt="Обложка" />);

    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toBe('Обложка');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('decoding')).toBe('async');
  });

  it('shows the fallback inside CardMedia', () => {
    const { container } = render(
      <Card>
        <CardMedia position="top">
          <Image src="/broken.png" alt="" fallback={<span>Нет обложки</span>} />
        </CardMedia>
      </Card>
    );

    fireEvent.error(container.querySelector('img')!);

    expect(screen.getByText('Нет обложки')).toBeTruthy();
    expect(container.querySelector('[data-slot="card-media"]')).toBeTruthy();
  });
});
