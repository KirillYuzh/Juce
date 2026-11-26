import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './PromptInput.module.css';
import { Icon } from '../ui/Icon';
import { Spinner } from '../ui/Display';
import { cx } from '../../lib/cx';

export type PromptInputStatus = 'ready' | 'submitted' | 'streaming' | 'error';

export interface PromptInputPayload {
  text: string;
  files: File[];
}

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: (payload: PromptInputPayload) => void;
  onStop?: () => void;
  status?: PromptInputStatus;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  maxFileSize?: number;
  hint?: string;
  actions?: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
}

const MAX_TEXTAREA_HEIGHT = 200;

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return accept.split(',').some((raw) => {
    const token = raw.trim().toLowerCase();
    if (!token) return false;
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} МБ`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${bytes} Б`;
}

export function PromptInput({
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onStop,
  status = 'ready',
  placeholder = 'Спросите про код, алгоритм или теорему…',
  disabled = false,
  accept,
  multiple = true,
  maxFileSize,
  hint = 'Enter — отправить, Shift+Enter — новая строка',
  actions,
  className,
  id,
  'aria-label': ariaLabel = 'Сообщение ассистенту',
}: PromptInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const [files, setFiles] = useState<File[]>([]);
  const [rejection, setRejection] = useState<string | null>(null);
  const controlled = value !== undefined;
  const text = controlled ? value : inner;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const generatedId = useId().replace(/:/g, '');
  const inputId = id ?? `prompt-${generatedId}`;
  const hintId = `${inputId}-hint`;

  const update = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    const next = `${Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    if (element.style.height !== next) element.style.height = next;
  }, [text]);

  const blocked = status === 'streaming' || status === 'submitted';
  const canSend = text.trim().length > 0 && !blocked && !disabled;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || blocked) return;
    onSubmit?.({ text: trimmed, files });
    if (!controlled) setInner('');
    setFiles([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const addFiles = (list: File[]) => {
    const accepted: File[] = [];
    let rejected: string | null = null;
    for (const file of list) {
      if (maxFileSize !== undefined && file.size > maxFileSize) {
        rejected = `Файл «${file.name}» больше ${formatSize(maxFileSize)}`;
        continue;
      }
      if (!matchesAccept(file, accept)) {
        rejected = `Файл «${file.name}» не подходит по типу`;
        continue;
      }
      accepted.push(file);
    }
    setRejection(rejected);
    if (accepted.length > 0) setFiles((current) => [...current, ...accepted]);
  };

  return (
    <form
      ref={formRef}
      className={cx(styles.form, className)}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <fieldset className={styles.group}>
        {files.length > 0 && (
          <div className={styles.attachments}>
            {files.map((file, index) => (
              <span className={styles.attachment} key={`${file.name}-${index}`}>
                <Icon name="file" size={14} />
                <span className={styles.attachmentName}>{file.name}</span>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label={`Убрать файл ${file.name}`}
                  onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                >
                  <Icon name="close" size={12} />
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          id={inputId}
          className={styles.textarea}
          value={text}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-describedby={hint ? hintId : undefined}
          aria-keyshortcuts="Enter"
          disabled={disabled}
          rows={1}
          onChange={(event) => update(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        />

        <div className={styles.toolbar}>
          <div className={styles.tools}>
            {actions}
            <button
              type="button"
              className={styles.attachButton}
              aria-label="Прикрепить файлы"
              disabled={disabled}
              onClick={() => fileRef.current?.click()}
            >
              <Icon name="paperclip" size={20} />
            </button>
            <input
              ref={fileRef}
              className={styles.fileInput}
              type="file"
              accept={accept}
              multiple={multiple}
              tabIndex={-1}
              onChange={(event) => {
                addFiles(Array.from(event.target.files ?? []));
                event.target.value = '';
              }}
            />
          </div>

          {(rejection || hint) && (
            <span id={hintId} className={styles.status} role={rejection ? 'alert' : undefined}>
              {rejection ?? hint}
            </span>
          )}

          {status === 'streaming' && onStop ? (
            <button
              type="button"
              className={cx(styles.send, styles.stop)}
              aria-label="Остановить ответ"
              onClick={onStop}
            >
              <Icon name="square" size={16} />
            </button>
          ) : (
            <button
              type="submit"
              className={styles.send}
              aria-label="Отправить сообщение"
              disabled={!canSend}
            >
              {status === 'submitted' ? <Spinner size={16} /> : <Icon name="arrowUp" size={20} />}
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}
