import { useId, type ReactNode } from 'react';
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

export function Textarea({ label, hint, error, fieldClassName, id, className, ...rest }: TextareaProps) {
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

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  fieldClassName?: string;
}

export function Select({ label, hint, error, options, fieldClassName, id, className, ...rest }: SelectProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <FieldShell label={label} hint={hint} error={error} id={inputId} className={fieldClassName}>
      <select id={inputId} className={cx(styles.select, className)} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.selectChevron} aria-hidden="true">
        <Icon name="chevronDown" size={20} />
      </span>
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
