import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './Fields.module.css';
import { Icon } from './Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  id: string;
  children: ReactNode;
  className?: string;
}

function FieldShell({ label, hint, error, id, children, className }: FieldShellProps) {
  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div className={cx(styles.control, error && styles.invalid)}>{children}</div>
      {error ? (
        <span className={styles.errorText} role="alert">
          {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  suffixSlot?: ReactNode;
  className?: string;
  fieldClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  suffixSlot,
  className,
  fieldClassName,
  id,
  ...rest
}: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell label={label} hint={hint} error={error} id={inputId} className={fieldClassName}>
      <input id={inputId} className={cx(styles.input, className)} {...rest} />
      {suffixSlot && <span className={styles.suffix}>{suffixSlot}</span>}
    </FieldShell>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fieldClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  fieldClassName,
  id,
  className,
  ...rest
}: TextareaProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell label={label} hint={hint} error={error} id={inputId} className={fieldClassName}>
      <textarea id={inputId} className={cx(styles.textarea, className)} {...rest} />
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'defaultValue' | 'onChange' | 'multiple' | 'size'
> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  fieldClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

/**
 * Listbox in the tabs look: a light track, a white pill with the current value
 * and the same pill treatment for the options. No native select involved.
 */
export function Select({
  label,
  hint,
  error,
  options,
  fieldClassName,
  id,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  ...rest
}: SelectProps) {
  const generated = useId();
  const triggerId = id ?? generated;
  const listId = `${triggerId}-listbox`;

  const [innerValue, setInnerValue] = useState(defaultValue ?? options[0]?.value ?? '');
  const current = value !== undefined ? value : innerValue;
  const selectedIndex = options.findIndex((option) => option.value === current);
  const selected = options[selectedIndex];

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    if (value === undefined) setInnerValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    setActiveIndex(Math.max(selectedIndex, 0));
    listRef.current?.focus();
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + options.length) % options.length);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(activeIndex);
        break;
      case 'Escape':
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <FieldShell label={label} hint={hint} error={error} id={triggerId} className={fieldClassName}>
      <div ref={wrapperRef} className={styles.selectWrap}>
        <button
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          id={triggerId}
          type="button"
          disabled={disabled}
          className={cx(styles.selectTrigger, className)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          onClick={() => setOpen((next) => !next)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <span className={cx(styles.selectValue, !selected && styles.selectPlaceholder)}>
            {selected?.label ?? 'Выберите'}
          </span>
          <span className={styles.selectChevron} aria-hidden="true">
            <Icon name="chevronDown" size={20} />
          </span>
        </button>

        {open && (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            tabIndex={-1}
            aria-labelledby={triggerId}
            aria-activedescendant={options[activeIndex] ? `${triggerId}-${activeIndex}` : undefined}
            className={styles.selectMenu}
            onKeyDown={onListKeyDown}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${triggerId}-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={cx(
                  styles.selectOption,
                  index === activeIndex && styles.selectOptionActive,
                  index === selectedIndex && styles.selectOptionSelected
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
              >
                {option.label}
                {index === selectedIndex && <Icon name="check" size={20} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}

export interface ChoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx(styles.choice, className)}>
      <input type="checkbox" {...rest} />
      <span className={styles.box} aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ label, className, ...rest }: ChoiceProps) {
  return (
    <label className={cx(styles.choice, className)}>
      <input type="radio" {...rest} />
      <span className={styles.radioCircle} aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
}

export function Switch({ label, className, ...rest }: SwitchProps) {
  return (
    <label className={cx(styles.switch, className)}>
      <input type="checkbox" role="switch" {...rest} />
      <span className={styles.switchTrack} aria-hidden="true" />
      {label && <span>{label}</span>}
    </label>
  );
}
