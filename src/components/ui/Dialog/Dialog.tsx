import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './Dialog.module.css';
import { Button, IconButton } from '../Button';
import { cx } from '../../../lib/cx';
import { lockScroll } from '../../../lib/scroll-lock';

export type DialogSize = 's' | 'm' | 'l';
export type DialogRole = 'dialog' | 'alertdialog';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string | null;
  descriptionId: string | null;
  setTitleId: (id: string | null) => void;
  setDescriptionId: (id: string | null) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(part: string): DialogContextValue {
  const value = useContext(DialogContext);
  if (!value) throw new Error(`<${part}> рендерится только внутри <Dialog>`);
  return value;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [titleId, setTitleIdState] = useState<string | null>(null);
  const [descriptionId, setDescriptionIdState] = useState<string | null>(null);

  const value: DialogContextValue = {
    open,
    setOpen: onOpenChange,
    titleId,
    descriptionId,
    setTitleId: setTitleIdState,
    setDescriptionId: setDescriptionIdState,
  };

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  const { open, setOpen } = useDialog('DialogTrigger');

  return (
    <Button aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(!open)}>
      {children}
    </Button>
  );
}

export interface DialogContentProps {
  children: ReactNode;
  size?: DialogSize;
  role?: DialogRole;
  closable?: boolean;
  className?: string;
}

export function DialogContent({
  children,
  size = 'm',
  role = 'dialog',
  closable = true,
  className,
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useDialog('DialogContent');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    if (!dialog.open) {
      restoreRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    }

    return () => {
      if (dialog.open) dialog.close();
      const restore = restoreRef.current;
      restoreRef.current = null;
      if (restore?.isConnected) restore.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    return lockScroll();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const cancel = (event: Event) => {
      event.preventDefault();
      setOpen(false);
    };

    dialog.addEventListener('cancel', cancel);
    return () => dialog.removeEventListener('cancel', cancel);
  }, [setOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={cx(styles.dialog, className)}
      data-slot="dialog-content"
      data-size={size}
      data-closable={closable || undefined}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId ?? undefined}
      aria-describedby={descriptionId ?? undefined}
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div className={styles.panel}>
        {closable && (
          <IconButton
            className={styles.close}
            icon="close"
            label="Закрыть"
            size="s"
            variant="ghost"
            onClick={() => setOpen(false)}
          />
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </dialog>
  );
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.header, className)} data-slot="dialog-header">
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  const { setTitleId } = useDialog('DialogTitle');
  const id = useId();

  useEffect(() => {
    setTitleId(id);
    return () => setTitleId(null);
  }, [id, setTitleId]);

  return (
    <h2 id={id} className={cx(styles.title, className)} data-slot="dialog-title">
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { setDescriptionId } = useDialog('DialogDescription');
  const id = useId();

  useEffect(() => {
    setDescriptionId(id);
    return () => setDescriptionId(null);
  }, [id, setDescriptionId]);

  return (
    <p id={id} className={cx(styles.description, className)} data-slot="dialog-description">
      {children}
    </p>
  );
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx(styles.footer, className)} data-slot="dialog-footer">
      {children}
    </div>
  );
}

export function DialogClose({ children, className }: { children?: ReactNode; className?: string }) {
  const { setOpen } = useDialog('DialogClose');

  if (children) {
    return (
      <Button variant="secondary" size="m" className={className} onClick={() => setOpen(false)}>
        {children}
      </Button>
    );
  }

  return (
    <IconButton
      className={className}
      icon="close"
      label="Закрыть"
      variant="ghost"
      onClick={() => setOpen(false)}
    />
  );
}
