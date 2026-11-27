import { useEffect, useState, type ReactNode } from 'react';
import styles from './PhotoGallery.module.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../Dialog';
import { IconButton } from '../Button';
import { Image } from '../Image';
import { Grid, type Space } from '../Layout';
import { cx } from '../../../lib/cx';

export interface PhotoGalleryItem {
  id?: string;
  src: string;
  alt: string;
  caption?: ReactNode;
  fallback?: ReactNode;
}

export interface PhotoGalleryProps {
  items: PhotoGalleryItem[];
  columns?: 2 | 3 | 4;
  gap?: Space;
  className?: string;
}

export function PhotoGallery({ items, columns = 3, gap = '3', className }: PhotoGalleryProps) {
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;
  const photo = active === null ? null : items[active];

  const step = (delta: number) =>
    setActive((value) => (value === null ? value : (value + delta + items.length) % items.length));

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const delta = event.key === 'ArrowLeft' ? -1 : 1;
      setActive((value) => (value === null ? value : (value + delta + items.length) % items.length));
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, items.length]);

  return (
    <div className={cx(styles.gallery, className)} data-slot="photo-gallery">
      <Grid columns={columns} gap={gap}>
        {items.map((item, index) => (
          <button
            key={item.id ?? item.src}
            type="button"
            className={styles.thumb}
            aria-label={`Открыть фото: ${item.alt}`}
            onClick={() => setActive(index)}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fallback={item.fallback}
              ratio="photo"
              className={styles.photo}
            />
          </button>
        ))}
      </Grid>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) setActive(null);
        }}
      >
        <DialogContent size="l">
          {photo && active !== null && (
            <>
              <DialogHeader>
                <DialogTitle>{photo.alt}</DialogTitle>
                {photo.caption && <DialogDescription>{photo.caption}</DialogDescription>}
              </DialogHeader>
              <Image
                src={photo.src}
                alt={photo.alt}
                fallback={photo.fallback}
                ratio="photo"
                loading="eager"
                className={styles.photo}
              />
              <div className={styles.bar}>
                <IconButton
                  icon="chevronLeft"
                  label="Предыдущее фото"
                  size="s"
                  variant="ghost"
                  onClick={() => step(-1)}
                />
                <span className={styles.counter}>
                  {active + 1} / {items.length}
                </span>
                <IconButton
                  icon="chevronRight"
                  label="Следующее фото"
                  size="s"
                  variant="ghost"
                  onClick={() => step(1)}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
