import { useState } from 'react';
import styles from './ProductShowcase.module.css';
import { Input, Select } from '../ui/Fields';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Display';
import { Icon } from '../ui/Icon';

export interface ProjectTemplate {
  id: string;
  image: string;
  label: string;
}

export interface ProductShowcaseProps {
  title?: string;
  designs: ProjectTemplate[];
  options: Array<{ value: string; label: string }>;
  onSubmit?: () => void;
}

export function ProductShowcase({
  title = 'Новая задача',
  designs,
  options,
  onSubmit,
}: ProductShowcaseProps) {
  const [selectedDesign, setSelectedDesign] = useState(designs[0]?.id);
  const activeDesign = designs.find((design) => design.id === selectedDesign);

  return (
    <div className={styles.showcase}>
      <div className={styles.preview}>
        <h3 className={styles.previewTitle}>{title}</h3>
        {activeDesign && (
          <img
            className={styles.previewCard}
            src={activeDesign.image}
            alt={`Шаблон задачи: ${activeDesign.label}`}
          />
        )}
        <div className={styles.note}>
          <Icon name="user" size={24} />
          <span>
            <span className={styles.noteTitle}>Джупсик подключён</span>
            Подскажет нужный раздел документации
          </span>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <div className={styles.progressRow}>
          <span>Готовность задачи</span>
          <span className={styles.progressValue}>5%</span>
        </div>
        <Progress value={5} />

        {designs.length > 0 && (
          <>
            <h4 className={styles.formTitle}>Выберите шаблон</h4>
            <div className={styles.designs}>
              {designs.map((design) => (
                <button
                  key={design.id}
                  type="button"
                  className={`${styles.design} ${design.id === activeDesign?.id ? styles.designActive : ''}`}
                  aria-label={design.label}
                  aria-pressed={design.id === activeDesign?.id}
                  onClick={() => setSelectedDesign(design.id)}
                >
                  <img src={design.image} alt="" />
                </button>
              ))}
            </div>
          </>
        )}

        <Select aria-label="Формат разбора" options={options} defaultValue={options[0]?.value} />

        <Input aria-label="Название задачи" placeholder="Название задачи*" required />
        <div className={styles.row}>
          <Input aria-label="Команда" placeholder="Команда" />
          <Input aria-label="Электронная почта" placeholder="Электронная почта*" type="email" required />
        </div>
        <Input aria-label="Дедлайн" placeholder="Дедлайн, например 2026-12-01" />

        <fieldset className={styles.radioGroup}>
          <legend className={styles.legend}>Нужен разбор по шагам?</legend>
          <label className={styles.radioCard}>
            Да
            <input type="radio" name="review" value="yes" defaultChecked />
            <span className={styles.radioDot} aria-hidden="true" />
          </label>
          <label className={styles.radioCard}>
            Позже
            <input type="radio" name="review" value="no" />
            <span className={styles.radioDot} aria-hidden="true" />
          </label>
        </fieldset>

        <label className={styles.legal} style={{ display: 'flex', gap: 12 }}>
          <input
            type="checkbox"
            style={{ width: 24, height: 24, accentColor: 'var(--tb-primary)' }}
          />
          <span>Присылать разборы по теме задачи</span>
        </label>

        <div className={styles.formFooter}>
          <p className={styles.legal}>
            Создавая задачу, я принимаю <a href="#">условия обработки данных</a> и правила
            платформы
          </p>
          <Button type="submit">Создать задачу</Button>
        </div>
      </form>
    </div>
  );
}
