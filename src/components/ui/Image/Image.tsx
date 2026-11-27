import { useEffect, useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import styles from './Image.module.css';
import { cx } from '../../../lib/cx';

export type ImageRatio = 'auto' | 'square' | 'video' | 'photo';
export type ImageStatus = 'loading' | 'loaded' | 'error';

export interface ImageProps {
  src?: string;
  /** Decorative images use alt="" */
  alt: string;
  fallback?: ReactNode;
  placeholder?: ReactNode;
  ratio?: ImageRatio;
  className?: string;
  imgClassName?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  referrerPolicy?: ImgHTMLAttributes<HTMLImageElement>['referrerPolicy'];
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ratioClass: Record<ImageRatio, string | undefined> = {
  auto: undefined,
  square: styles.square,
  video: styles.video,
  photo: styles.photo,
};

export function Image({
  src,
  alt,
  fallback,
  placeholder,
  ratio = 'auto',
  className,
  imgClassName,
  loading = 'lazy',
  decoding = 'async',
  referrerPolicy = 'no-referrer',
  srcSet,
  sizes,
  onLoad,
  onError,
}: ImageProps) {
  const [status, setStatus] = useState<ImageStatus>('loading');

  useEffect(() => {
    setStatus('loading');
  }, [src]);

  const state: ImageStatus = src ? status : 'error';

  return (
    <span
      className={cx(styles.root, ratioClass[ratio], className)}
      data-slot="image"
      data-state={state}
      role={state === 'error' && alt ? 'img' : undefined}
      aria-label={state === 'error' && alt ? alt : undefined}
    >
      {state === 'error' ? (
        fallback ? (
          <span className={styles.fallback}>{fallback}</span>
        ) : null
      ) : (
        <>
          <img
            className={cx(styles.img, imgClassName)}
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            loading={loading}
            decoding={decoding}
            referrerPolicy={referrerPolicy}
            onLoad={() => {
              setStatus('loaded');
              onLoad?.();
            }}
            onError={() => {
              setStatus('error');
              onError?.();
            }}
          />
          {state === 'loading' && placeholder ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : null}
        </>
      )}
    </span>
  );
}
