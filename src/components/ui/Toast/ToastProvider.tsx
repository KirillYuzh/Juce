import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';
import { Icon, type IconName } from '../Icon';
import { Button, IconButton } from '../Button';
import { Text } from '../Typography/Typography';

export type ToastTone = 'neutral' | 'success' | 'error' | 'warning';
export type ToastPosition = 'top-right' | 'bottom-right' | 'bottom-center';

export interface ToastAction {
  label: ReactNode;
  onClick: () => void;
}

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
  action?: ToastAction;
}

export interface ToastApi {
  toast: (options: ToastOptions) => string;
  dismiss: (id?: string) => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  position?: ToastPosition;
  max?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
  tone: ToastTone;
  duration: number;
}

const TOAST_ICONS: Record<ToastTone, IconName> = {
  neutral: 'info',
  success: 'checkCircle',
  error: 'alertCircle',
  warning: 'alertCircle',
};

const DEFAULT_DURATION = 5000;
const DEFAULT_MAX = 3;

const ToastContext = createContext<ToastApi | null>(null);

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: (id?: string) => void }) {
  const { id, title, description, tone, duration, action } = item;
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;
  const remaining = useRef(duration);
  const started = useRef(0);

  useEffect(() => {
    if (paused) return;
    started.current = Date.now();
    const timer = setTimeout(() => onDismiss(id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (Date.now() - started.current));
    };
  }, [paused, id, onDismiss]);

  return (
    <div
      className={styles.toast}
      data-tone={tone}
      role={tone === 'error' ? 'alert' : 'status'}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node && event.currentTarget.contains(next))) setFocused(false);
      }}
    >
      <span className={styles.icon}>
        <Icon name={TOAST_ICONS[tone]} size={20} />
      </span>
      <div className={styles.body}>
        <div className={styles.head}>
          <Text as="p" size="m" weight="medium" className={styles.title}>
            {title}
          </Text>
          <IconButton
            icon="close"
            label="Закрыть уведомление"
            size="xs"
            variant="plain"
            className={styles.close}
            onClick={() => onDismiss(id)}
          />
        </div>
        {description || action ? (
          <div className={styles.footer}>
            {description ? (
              <Text as="p" size="s" tone="secondary" className={styles.description}>
                {description}
              </Text>
            ) : null}
            {action ? (
              <Button variant="outline" size="s" className={styles.action} onClick={action.onClick}>
                {action.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  max = DEFAULT_MAX,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const baseId = useId();
  const nextIndex = useRef(0);
  const limit = Math.max(1, max);

  const dismiss = useCallback((id?: string) => {
    setToasts((current) => (id === undefined ? [] : current.filter((toast) => toast.id !== id)));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `${baseId}-${nextIndex.current}`;
      nextIndex.current += 1;
      const item: ToastItem = {
        ...options,
        id,
        tone: options.tone ?? 'neutral',
        duration: options.duration ?? DEFAULT_DURATION,
      };
      setToasts((current) => [...current, item].slice(-limit));
      return id;
    },
    [baseId, limit]
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  const [container, setContainer] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.body
  );
  const containerRef = useRef(container);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const resolve = () => {
      const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[open]');
      const next = dialogs.length > 0 ? dialogs[dialogs.length - 1] : document.body;
      if (containerRef.current === next) return;
      containerRef.current = next;
      setContainer(next);
    };

    resolve();
    const observer = new MutationObserver(resolve);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['open'],
    });

    return () => observer.disconnect();
  }, []);

  const region =
    toasts.length > 0 && container
      ? createPortal(
          <div className={styles.region} data-position={position}>
            {toasts.map((item) => (
              <ToastView key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          container
        )
      : null;

  return (
    <ToastContext.Provider value={api}>
      {children}
      {region}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast доступен только внутри ToastProvider');
  return api;
}
