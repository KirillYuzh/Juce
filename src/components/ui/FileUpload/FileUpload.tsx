import { useId, useRef, useState, type ReactNode } from 'react';
import styles from './FileUpload.module.css';
import { Icon } from '../Icon';
import { IconButton } from '../Button';
import { Text } from '../Typography/Typography';
import { cx } from '../../../lib/cx';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  label?: ReactNode;
  formats?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Файлы больше maxSize отбрасываются; onFiles вызывается только при оставшихся файлах. */
  maxSize?: number;
  value?: File[];
  onFiles: (files: File[]) => void;
  onRemove?: (file: File) => void;
  className?: string;
}

const DEFAULT_LABEL = 'Нажмите для загрузки или перетащите';
const ANY_FILES = 'Любые файлы';

const MIME_FORMATS: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/png': 'PNG',
  'image/jpeg': 'JPG',
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} МБ`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${bytes} Б`;
}

function formatToken(raw: string) {
  const token = raw.trim().toLowerCase();
  if (token.startsWith('.')) return token.slice(1).toUpperCase();
  const known = MIME_FORMATS[token];
  if (known) return known;
  const slash = token.indexOf('/');
  return (slash === -1 ? token : token.slice(slash + 1)).toUpperCase();
}

function formatAccept(accept?: string) {
  if (!accept) return ANY_FILES;
  return accept.split(',').map(formatToken).filter(Boolean).join(', ');
}

export function FileUpload({
  accept,
  multiple = false,
  disabled = false,
  label,
  formats,
  hint,
  error,
  maxSize,
  value,
  onFiles,
  onRemove,
  className,
}: FileUploadProps) {
  const generated = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const labelId = `${generated}-label`;
  const formatsId = `${generated}-formats`;
  const hintId = `${generated}-hint`;
  const errorId = `${generated}-error`;
  const shownError = error ?? sizeError;
  const isError = Boolean(shownError);
  const describedBy = [formatsId, hint ? hintId : null, shownError ? errorId : null]
    .filter((value): value is string => value !== null)
    .join(' ');

  const acceptFiles = (files: File[]) => {
    const oversized = files.filter((file) => maxSize !== undefined && file.size > maxSize);
    const fitting = files.filter((file) => maxSize === undefined || file.size <= maxSize);
    const picked = multiple ? fitting : fitting.slice(0, 1);

    setSizeError(
      oversized.length > 0 && maxSize !== undefined
        ? `Превышен размер, максимум ${formatBytes(maxSize)}: ${oversized
            .map((file) => file.name)
            .join(', ')}`
        : null
    );

    if (picked.length > 0) onFiles(picked);
  };

  return (
    <div className={cx(styles.root, className)}>
      <input
        ref={inputRef}
        id={generated}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        tabIndex={-1}
        className={styles.input}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={isError || undefined}
        onChange={(event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          event.currentTarget.value = '';
          acceptFiles(files);
        }}
      />

      <div
        className={styles.zone}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-invalid={isError || undefined}
        data-dragging={dragging || undefined}
        data-disabled={disabled || undefined}
        data-invalid={isError || undefined}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!disabled) inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          const next = event.relatedTarget;
          if (!(next instanceof Node && event.currentTarget.contains(next))) setDragging(false);
        }}
        onDrop={(event) => {
          if (disabled) return;
          event.preventDefault();
          setDragging(false);
          acceptFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <span className={styles.zoneIcon}>
          <Icon name="upload" size={28} />
        </span>
        <Text as="span" id={labelId} size="m" weight="medium">
          {label ?? DEFAULT_LABEL}
        </Text>
        <Text as="span" id={formatsId} size="s" tone="muted">
          {formats ?? formatAccept(accept)}
          {maxSize !== undefined ? ` · до ${formatBytes(maxSize)}` : null}
        </Text>
        {hint ? (
          <Text as="span" id={hintId} size="s" tone="secondary">
            {hint}
          </Text>
        ) : null}
      </div>

      {value && value.length > 0 ? (
        <ul className={styles.fileList}>
          {value.map((file, index) => (
            <li key={`${file.name}-${index}`} className={styles.fileItem}>
              <span className={styles.fileName}>{file.name}</span>
              {onRemove ? (
                <IconButton
                  icon="close"
                  label={`Удалить ${file.name}`}
                  size="xs"
                  variant="plain"
                  onClick={() => onRemove(file)}
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {shownError ? (
        <Text as="span" id={errorId} size="s" tone="error" role="alert">
          {shownError}
        </Text>
      ) : null}
    </div>
  );
}
