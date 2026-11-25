import { useEffect, useId, useRef, type ReactNode } from 'react';
import styles from './AlertDialog.module.css';
import { Button } from '../Button';
import { cx } from '../../../lib/cx';

export interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  className?: string;
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Подтвердить',
  cancelLabel = 'Отмена',
  onConfirm,
  className,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) {
        triggerRef.current =
          document.activeElement instanceof HTMLElement ? document.activeElement : null;
        dialog.showModal();
      }
      dialog.querySelector<HTMLButtonElement>('button')?.focus();
      return;
    }
    if (dialog.open) dialog.close();
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const cancel = (event: Event) => {
      event.preventDefault();
      onOpenChange(false);
    };
    dialog.addEventListener('cancel', cancel);
    return () => dialog.removeEventListener('cancel', cancel);
  }, [onOpenChange]);

  return (
    <dialog
      ref={dialogRef}
      className={cx(styles.dialog, className)}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <div className={styles.content}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {description && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" size="m" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="m"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
