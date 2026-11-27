import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './Fields.module.css';
import { Chip } from './Display';
import { Icon } from './Icon';
import { cx } from '../../lib/cx';
import { radiusStyle, type RadiusValue } from '../../lib/radius';
import { useControllableState } from '../../lib/use-controllable-state';
import { useDismiss } from '../../lib/use-dismiss';

interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredMark?: boolean;
  id: string;
  children: ReactNode;
  className?: string;
  controlClassName?: string;
  controlStyle?: CSSProperties;
}

function FieldShell({
  label,
  hint,
  error,
  required,
  requiredMark = true,
  id,
  children,
  className,
  controlClassName,
  controlStyle,
}: FieldShellProps) {
  return (
    <div className={cx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && requiredMark && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div
        className={cx(styles.control, controlClassName, error && styles.invalid)}
        style={controlStyle}
      >
        {children}
      </div>
      {error ? (
        <span id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className={styles.hint}>
            {hint}
          </span>
        )
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

interface TextFieldOptions {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  'aria-label'?: string;
}

function useTextField({
  id,
  label,
  hint,
  error,
  placeholder,
  'aria-label': ariaLabel,
}: TextFieldOptions) {
  const generated = useId();
  const controlId = id ?? generated;
  const floating = !label && Boolean(placeholder);

  return {
    controlId,
    floating,
    fieldProps: {
      placeholder: floating ? ' ' : placeholder,
      'aria-label': label ? undefined : (ariaLabel ?? placeholder),
      'aria-describedby': describedBy(controlId, hint, error),
      'aria-invalid': error ? true : undefined,
    },
  };
}

function FloatingPlaceholder({
  text,
  required,
  requiredMark,
  className,
}: {
  text?: string;
  required?: boolean;
  requiredMark: boolean;
  className?: string;
}) {
  return (
    <span className={cx(styles.placeholderOverlay, className)} aria-hidden="true">
      {text}
      {required && requiredMark && <span className={styles.requiredMark}>*</span>}
    </span>
  );
}

export type InputSize = 's' | 'm' | 'l';

export interface InputProps extends Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  label?: string;
  hint?: string;
  error?: string;
  size?: InputSize;
  radius?: RadiusValue;
  requiredMark?: boolean;
  suffixSlot?: ReactNode;
  className?: string;
  fieldClassName?: string;
}

export function Input({
  label,
  hint,
  error,
  size = 'l',
  radius,
  requiredMark = true,
  suffixSlot,
  className,
  fieldClassName,
  id,
  style,
  required,
  placeholder,
  'aria-label': ariaLabel,
  ref,
  ...rest
}: InputProps) {
  const { controlId, floating, fieldProps } = useTextField({
    id,
    label,
    hint,
    error,
    placeholder,
    'aria-label': ariaLabel,
  });

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={controlId}
      className={fieldClassName}
      controlClassName={styles[`control-${size}`]}
      controlStyle={radiusStyle(radius)}
    >
      <input
        ref={ref}
        id={controlId}
        className={cx(styles.input, styles[`size-${size}`], floating && styles.float, className)}
        style={radiusStyle(radius, style)}
        required={required}
        {...fieldProps}
        {...rest}
      />
      {floating && (
        <FloatingPlaceholder
          text={placeholder}
          required={required}
          requiredMark={requiredMark}
          className={cx(styles.placeholderInput, size === 's' && styles.placeholderSmall)}
        />
      )}
      {suffixSlot && <span className={styles.suffix}>{suffixSlot}</span>}
    </FieldShell>
  );
}

export interface TextareaProps extends React.ComponentPropsWithRef<'textarea'> {
  label?: string;
  hint?: string;
  error?: string;
  requiredMark?: boolean;
  fieldClassName?: string;
}

export function Textarea({
  label,
  hint,
  error,
  requiredMark = true,
  fieldClassName,
  id,
  className,
  required,
  placeholder,
  'aria-label': ariaLabel,
  ref,
  ...rest
}: TextareaProps) {
  const { controlId, floating, fieldProps } = useTextField({
    id,
    label,
    hint,
    error,
    placeholder,
    'aria-label': ariaLabel,
  });

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={controlId}
      className={fieldClassName}
      controlClassName={styles['control-textarea']}
    >
      <textarea
        ref={ref}
        id={controlId}
        className={cx(styles.textarea, floating && styles.float, className)}
        required={required}
        {...fieldProps}
        {...rest}
      />
      {floating && (
        <FloatingPlaceholder
          text={placeholder}
          required={required}
          requiredMark={requiredMark}
          className={styles.placeholderTextarea}
        />
      )}
    </FieldShell>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue' | 'onChange' | 'type'
> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredMark?: boolean;
  options: SelectOption[];
  fieldClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Select({
  label,
  hint,
  error,
  requiredMark = true,
  options,
  fieldClassName,
  id,
  name,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  ...rest
}: SelectProps) {
  const generated = useId();
  const triggerId = id ?? generated;
  const listId = `${triggerId}-listbox`;

  const [current, setCurrent] = useControllableState({
    value,
    defaultValue: defaultValue ?? options[0]?.value ?? '',
    onChange,
  });
  const selectedIndex = options.findIndex((option) => option.value === current);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wasOpen = useRef(false);
  const restoreFocusRef = useRef(false);

  const openSelect = () => {
    if (disabled || !options.length) return;
    setOpen(true);
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option) return;
    setCurrent(option.value);
    setOpen(false);
  };

  useEffect(() => {
    if (value !== undefined) return;
    if (!options.length) {
      if (current !== '') setCurrent('');
      return;
    }
    if (!options.some((option) => option.value === current)) {
      const first = options[0];
      if (first) setCurrent(first.value);
    }
  }, [options, value, current, setCurrent]);

  useEffect(() => {
    if (!options.length) setOpen(false);
  }, [options.length]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
      listRef.current?.focus();
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      const restore = restoreFocusRef.current;
      restoreFocusRef.current = false;
      if (restore) triggerRef.current?.focus();
    }
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    document.getElementById(`${triggerId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, triggerId]);

  useDismiss({ open, onDismiss: () => setOpen(false), ref: wrapperRef, escape: false });

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (!options.length) return;
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
        restoreFocusRef.current = true;
        choose(activeIndex);
        break;
      case 'Escape':
        restoreFocusRef.current = true;
        setOpen(false);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <FieldShell
      label={label}
      hint={hint}
      error={error}
      required={required}
      requiredMark={requiredMark}
      id={triggerId}
      className={fieldClassName}
    >
      <div ref={wrapperRef} className={styles.selectWrap}>
        {name && <input type="hidden" name={name} value={current} />}
        <button
          {...rest}
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          className={cx(styles.selectTrigger, className)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(triggerId, hint, error)}
          aria-controls={open && options.length ? listId : undefined}
          onClick={() => (open ? setOpen(false) : openSelect())}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openSelect();
            }
          }}
        >
          <span className={cx(styles.selectValue, !selected && styles.selectPlaceholder)}>
            {selected?.label ?? 'Выберите'}
          </span>
          {!label && required && requiredMark && (
            <span className={styles.requiredMark} aria-hidden="true">
              *
            </span>
          )}
          <span className={styles.selectChevron} aria-hidden="true">
            <Icon name="chevronDown" size={20} />
          </span>
        </button>

        {open && options.length > 0 && (
          <div className={styles.selectMenu}>
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              tabIndex={-1}
              aria-labelledby={triggerId}
              aria-activedescendant={
                options[activeIndex] ? `${triggerId}-${activeIndex}` : undefined
              }
              className={cx(styles.selectList, 'tb-scroll-fade-y')}
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
          </div>
        )}
      </div>
    </FieldShell>
  );
}

export interface ChipSelectOption {
  value: string;
  label: string;
}

export interface ChipSelectProps {
  options: ChipSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  fieldClassName?: string;
  'aria-label'?: string;
}

export function ChipSelect({
  options,
  value,
  onChange,
  label,
  hint,
  className,
  fieldClassName,
  'aria-label': ariaLabel,
}: ChipSelectProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option]);
  };

  return (
    <div className={cx(styles.field, fieldClassName)}>
      {label && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      <div
        className={cx(styles.chipGroup, className)}
        role="group"
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={hint ? hintId : undefined}
      >
        {options.map((option) => (
          <Chip
            key={option.value}
            variant="outline"
            active={value.includes(option.value)}
            onClick={() => toggle(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
    </div>
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
