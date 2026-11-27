import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PhotoGallery, type PhotoGalleryItem } from './PhotoGallery';

const items: PhotoGalleryItem[] = [
  { id: 'a', src: '/forest.jpg', alt: 'Лес', caption: 'Утренний лес' },
  { id: 'b', src: '/river.jpg', alt: 'Река', caption: 'Горная река' },
  { id: 'c', src: '/house.jpg', alt: 'Дом', caption: 'Домик у озера' },
];

const dialog = () => {
  const element = document.querySelector('dialog');
  if (!element) throw new Error('Диалог не отрендерен');
  return element;
};

const openPhoto = (alt: string) => fireEvent.click(screen.getByRole('button', { name: `Открыть фото: ${alt}` }));

describe('PhotoGallery', () => {
  it('opens the viewer on a thumbnail click', () => {
    render(<PhotoGallery items={items} />);

    expect(dialog().open).toBe(false);
    expect(screen.getAllByAltText('Лес')).toHaveLength(1);

    openPhoto('Лес');

    expect(dialog().open).toBe(true);
    expect(screen.getByText('Утренний лес')).toBeTruthy();
    expect(screen.getByText('1 / 3')).toBeTruthy();
    expect(screen.getAllByAltText('Лес')).toHaveLength(2);
  });

  it('moves through photos with the next and previous buttons', () => {
    render(<PhotoGallery items={items} />);
    openPhoto('Лес');

    fireEvent.click(screen.getByRole('button', { name: 'Следующее фото' }));
    expect(screen.getByText('2 / 3')).toBeTruthy();
    expect(screen.getByText('Горная река')).toBeTruthy();
    expect(screen.queryByText('Утренний лес')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }));
    expect(screen.getByText('1 / 3')).toBeTruthy();
    expect(screen.getByText('Утренний лес')).toBeTruthy();
  });

  it('wraps around at both ends', () => {
    render(<PhotoGallery items={items} />);
    openPhoto('Лес');

    fireEvent.click(screen.getByRole('button', { name: 'Предыдущее фото' }));
    expect(screen.getByText('3 / 3')).toBeTruthy();
    expect(screen.getByText('Домик у озера')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Следующее фото' }));
    expect(screen.getByText('1 / 3')).toBeTruthy();
  });

  it('moves through photos with the arrow keys', () => {
    render(<PhotoGallery items={items} />);
    openPhoto('Лес');

    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(screen.getByText('2 / 3')).toBeTruthy();

    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(screen.getByText('1 / 3')).toBeTruthy();
  });

  it('closes the viewer and returns focus to the thumbnail', () => {
    render(<PhotoGallery items={items} />);
    const thumb = screen.getByRole('button', { name: 'Открыть фото: Река' });

    thumb.focus();
    fireEvent.click(thumb);
    expect(dialog().open).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));

    expect(dialog().open).toBe(false);
    expect(document.activeElement).toBe(thumb);
    expect(screen.queryByText('2 / 3')).toBeNull();
  });

  it('lays thumbnails out with the requested columns', () => {
    const { container } = render(<PhotoGallery items={items} columns={4} gap="6" />);
    const grid = container.querySelector<HTMLElement>('[data-slot="photo-gallery"] > div');

    expect(grid?.style.getPropertyValue('--tb-grid-columns')).toBe('4');
    expect(grid?.style.getPropertyValue('--tb-grid-gap')).toBe('var(--tb-space-6)');
  });
});
