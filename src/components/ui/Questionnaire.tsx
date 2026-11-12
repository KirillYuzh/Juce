import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import styles from './Questionnaire.module.css';
import { Button } from './Button';
import { Icon } from './Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export type QuestionnaireAnswers = Record<string, string | string[]>;

export interface QuestionnaireChoiceConfig {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionnaireItemConfig {
  name: string;
  prompt: string;
  description?: string;
  required?: boolean;
  multiple?: boolean;
  choices?: QuestionnaireChoiceConfig[];
  /** Freeform answer shown under the choices. */
  input?: { label: string; placeholder?: string };
}

interface QuestionnaireContextValue {
  items: readonly QuestionnaireItemConfig[];
  index: number;
  answers: QuestionnaireAnswers;
  error: string | null;
  isFirst: boolean;
  isLast: boolean;
  active: QuestionnaireItemConfig | undefined;
  toggleChoice: (item: QuestionnaireItemConfig, value: string) => void;
  setInput: (item: QuestionnaireItemConfig, value: string) => void;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  skip: () => void;
  submit: () => void;
}

const QuestionnaireContext = createContext<QuestionnaireContextValue | null>(null);

function useQuestionnaire(component: string): QuestionnaireContextValue {
  const context = useContext(QuestionnaireContext);
  if (!context) throw new Error(`${component} must be used inside <Questionnaire>`);
  return context;
}

const otherKey = (name: string) => `${name}__other`;

function answered(item: QuestionnaireItemConfig, answers: QuestionnaireAnswers) {
  const other = answers[otherKey(item.name)];
  if (typeof other === 'string' && other.trim()) return true;
  const value = answers[item.name];
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value && value.trim());
}

export interface QuestionnaireProps {
  items: readonly QuestionnaireItemConfig[];
  onSubmit: (answers: QuestionnaireAnswers) => void;
  defaultValues?: QuestionnaireAnswers;
  children: ReactNode;
  className?: string;
}

/**
 * Multi-step questionnaire: one question at a time, single or multiple choice,
 * a freeform answer and a skip for optional steps. Answers are a plain object,
 * so the host decides what to do with them.
 */
export function Questionnaire({
  items,
  onSubmit,
  defaultValues,
  children,
  className,
}: QuestionnaireProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(defaultValues ?? {});
  const [error, setError] = useState<string | null>(null);

  const active = items[index];
  const isFirst = index === 0;
  const isLast = index === items.length - 1;

  const goTo = (next: number) => {
    setError(null);
    setIndex(Math.min(Math.max(next, 0), items.length - 1));
  };

  const toggleChoice = (item: QuestionnaireItemConfig, value: string) => {
    setError(null);
    setAnswers((current) => {
      // Picking a fixed answer drops the freeform one: they are alternatives.
      const next = { ...current };
      delete next[otherKey(item.name)];
      if (!item.multiple) return { ...next, [item.name]: value };
      const list = Array.isArray(current[item.name]) ? (current[item.name] as string[]) : [];
      const exists = list.includes(value);
      return {
        ...next,
        [item.name]: exists ? list.filter((entry) => entry !== value) : [...list, value],
      };
    });
  };

  const setInput = (item: QuestionnaireItemConfig, value: string) => {
    setError(null);
    setAnswers((current) => {
      const next = { ...current, [otherKey(item.name)]: value };
      if (value.trim() && !item.multiple) delete next[item.name];
      return next;
    });
  };

  const next = () => {
    if (!active) return;
    if (active.required && !answered(active, answers)) {
      setError('Выберите ответ, чтобы продолжить');
      return;
    }
    goTo(index + 1);
  };

  const submit = () => {
    const invalid = items.findIndex((item) => item.required && !answered(item, answers));
    if (invalid >= 0) {
      setIndex(invalid);
      setError('Выберите ответ, чтобы продолжить');
      return;
    }
    // Fold "other" answers into their own name and drop empty entries.
    const result: QuestionnaireAnswers = {};
    items.forEach((item) => {
      const other = answers[otherKey(item.name)];
      if (typeof other === 'string' && other.trim()) {
        result[item.name] = other.trim();
        return;
      }
      const value = answers[item.name];
      if (Array.isArray(value) ? value.length : value) result[item.name] = value;
    });
    onSubmit(result);
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        items,
        index,
        answers,
        error,
        isFirst,
        isLast,
        active,
        toggleChoice,
        setInput,
        goTo,
        next,
        previous: () => goTo(index - 1),
        skip: () => goTo(index + 1),
        submit,
      }}
    >
      <form
        className={cx(styles.form, className)}
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          if (isLast) submit();
          else next();
        }}
      >
        {children}
      </form>
    </QuestionnaireContext.Provider>
  );
}

export function QuestionnaireProgress({ className }: { className?: string }) {
  const { index, items } = useQuestionnaire('QuestionnaireProgress');
  const total = items.length || 1;
  return (
    <div className={cx(styles.progress, className)}>
      <span className={styles.progressText}>
        Вопрос {Math.min(index + 1, total)} из {total}
      </span>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-label="Пройдено вопросов"
      >
        <span
          className={styles.progressFill}
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

export interface QuestionnaireItemProps {
  name: string;
  children: ReactNode;
  className?: string;
}

export function QuestionnaireItem({ name, children, className }: QuestionnaireItemProps) {
  const { items, index } = useQuestionnaire('QuestionnaireItem');
  const position = items.findIndex((item) => item.name === name);
  const isActive = position === index;
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const mounted = useRef(false);

  // Focus the new step, but never steal focus on the first paint.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!isActive) return;
    const first = fieldsetRef.current?.querySelector<HTMLInputElement>('input');
    first?.focus({ preventScroll: true });
  }, [isActive]);

  return (
    <fieldset
      ref={fieldsetRef}
      className={cx(styles.item, className)}
      hidden={!isActive}
      inert={!isActive || undefined}
    >
      {children}
    </fieldset>
  );
}

export function QuestionnaireTitle({ children }: { children: ReactNode }) {
  return <legend className={styles.title}>{children}</legend>;
}

export function QuestionnaireDescription({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className={styles.description}>{children}</p>;
}

export function QuestionnaireChoices({ children }: { children: ReactNode }) {
  return <div className={styles.choices}>{children}</div>;
}

export interface QuestionnaireChoiceProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function QuestionnaireChoice({ value, children, className }: QuestionnaireChoiceProps) {
  const { active, answers, toggleChoice } = useQuestionnaire('QuestionnaireChoice');
  if (!active) return null;

  const multiple = Boolean(active.multiple);
  const answer = answers[active.name];
  const selected = multiple
    ? Array.isArray(answer) && answer.includes(value)
    : answer === value;
  const letter = String.fromCharCode(
    65 + Math.max(active.choices?.findIndex((choice) => choice.value === value) ?? 0, 0)
  );

  return (
    <label
      className={cx(styles.choice, className)}
      data-selected={selected || undefined}
      data-multiple={multiple || undefined}
    >
      <input
        type={multiple ? 'checkbox' : 'radio'}
        name={active.name}
        value={value}
        checked={selected}
        onChange={() => toggleChoice(active, value)}
      />
      <span className={styles.choiceBody}>{children}</span>
      <span className={styles.choiceMark} aria-hidden="true">
        {multiple && selected ? <Icon name="check" size={16} /> : letter}
      </span>
    </label>
  );
}

export interface QuestionnaireInputProps {
  label: string;
  placeholder?: string;
  className?: string;
}

export function QuestionnaireInput({ label, placeholder, className }: QuestionnaireInputProps) {
  const { active, answers, setInput } = useQuestionnaire('QuestionnaireInput');
  const id = useId();
  if (!active) return null;
  const value = answers[otherKey(active.name)];

  return (
    <div className={cx(styles.inputRow, className)}>
      <label className={styles.inputLabel} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        type="text"
        placeholder={placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(event) => setInput(active, event.target.value)}
      />
    </div>
  );
}

export function QuestionnaireError() {
  const { error } = useQuestionnaire('QuestionnaireError');
  if (!error) return null;
  return (
    <p className={styles.error} role="alert">
      <Icon name="alertCircle" size={16} />
      {error}
    </p>
  );
}

export function QuestionnaireActions({ children }: { children: ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

export function QuestionnairePrevious({ label = 'Назад' }: { label?: string }) {
  const { isFirst, previous } = useQuestionnaire('QuestionnairePrevious');
  return (
    <Button variant="outline" size="m" disabled={isFirst} onClick={previous}>
      {label}
    </Button>
  );
}

export function QuestionnaireSkip({ label = 'Пропустить' }: { label?: string }) {
  const { active, isLast, skip } = useQuestionnaire('QuestionnaireSkip');
  if (!active || active.required || isLast) return null;
  return (
    <Button variant="ghost" size="m" onClick={skip}>
      {label}
    </Button>
  );
}

export function QuestionnaireNext({ label = 'Далее' }: { label?: string }) {
  const { isLast } = useQuestionnaire('QuestionnaireNext');
  if (isLast) return null;
  return (
    <Button variant="primary" size="m" type="submit">
      {label}
    </Button>
  );
}

export function QuestionnaireSubmit({ label = 'Отправить' }: { label?: string }) {
  const { isLast } = useQuestionnaire('QuestionnaireSubmit');
  if (!isLast) return null;
  return (
    <Button variant="primary" size="m" type="submit">
      {label}
    </Button>
  );
}
