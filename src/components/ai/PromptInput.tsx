import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './PromptInput.module.css';
import { Icon } from '../ui/Icon';
import { Spinner } from '../ui/Display';
import { cx } from '../../lib/cx';
import { useDomId } from '../../lib/use-id';

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
  hint?: string;
  actions?: ReactNode;
  className?: string;
  id?: string;
  'aria-label'?: string;
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
  hint = 'Enter — отправить, Shift+Enter — новая строка',
  actions,
  className,
  id,
  'aria-label': ariaLabel = 'Сообщение ассистенту',
}: PromptInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const [files, setFiles] = useState<File[]>([]);
  const controlled = value !== undefined;
  const text = controlled ? value : inner;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitLock = useRef(false);
  const generatedId = useDomId();
  const inputId = id ?? `prompt-${generatedId}`;

  const update = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`;
  }, [text]);

  useEffect(() => {
    submitLock.current = false;
  }, [text, status]);

  const blocked = status === 'streaming' || status === 'submitted';
  const canSend = text.trim().length > 0 && !blocked && !disabled;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled || blocked || submitLock.current) return;
    submitLock.current = true;
    onSubmit?.({ text: trimmed, files });
    update('');
    setFiles([]);
    if (fileRef.current) fileRef.current.value = '';
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
      <fieldset
        className={styles.group}
        disabled={disabled}
        onMouseDown={(event) => {
          const target = event.target as Element;
          if (target === textareaRef.current) return;
          event.preventDefault();
          if (target.closest('button, label, a, input, [role="button"]')) return;
          textareaRef.current?.focus();
        }}
      >
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
          disabled={disabled}
          rows={1}
          onChange={(event) => update(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
            event.preventDefault();
            if (event.repeat) return;
            formRef.current?.requestSubmit();
          }}
        />

        <div className={styles.toolbar}>
          <div className={styles.tools}>
            {actions}
            <button
              type="button"
              className={styles.attachButton}
              aria-label="Прикрепить файлы"
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
                const next = Array.from(event.target.files ?? []);
                setFiles((current) => [...current, ...next]);
              }}
            />
          </div>

          {hint && <span className={styles.status}>{hint}</span>}

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
