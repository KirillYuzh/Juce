import { useState } from 'react';
import styles from './ProductShowcase.module.css';
import { Input, Select } from '../ui/Fields';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Display';
import { Icon } from '../ui/Icon';

export interface CardDesign {
  id: string;
  image: string;
  label: string;
}

export interface ProductShowcaseProps {
  title?: string;
  designs: CardDesign[];
  cashbackOptions: Array<{ value: string; label: string }>;
  onSubmit?: () => void;
}

export function ProductShowcase({
  title = 'Дебетовая карта Black',
  designs,
  cashbackOptions,
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
            alt={`Дизайн карты: ${activeDesign.label}`}
          />
        )}
        <div className={styles.note}>
          <Icon name="user" size={24} />
          <span>
            <span className={styles.noteTitle}>Оформление без паспорта</span>
            Будет нужен при получении карты
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
          <span>Уже заполнено</span>
          <span className={styles.progressValue}>5%</span>
        </div>
        <Progress value={5} />

        {designs.length > 0 && (
          <>
            <h4 className={styles.formTitle}>Выберите дизайн карты</h4>
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

        <Select
          aria-label="Повышенный кэшбэк"
          options={cashbackOptions}
          defaultValue={cashbackOptions[0]?.value}
        />

        <Input
          aria-label="Фамилия, имя и отчество"
          placeholder="Фамилия, имя и отчество*"
          required
        />
        <div className={styles.row}>
          <Input
            aria-label="Мобильный телефон"
            placeholder="Мобильный телефон*"
            type="tel"
            required
          />
          <Input aria-label="Электронная почта" placeholder="Электронная почта" type="email" />
        </div>
        <Input aria-label="Дата рождения" placeholder="Дата рождения*" />

        <fieldset className={styles.radioGroup}>
          <legend className={styles.legend}>Гражданство РФ?</legend>
          <label className={styles.radioCard}>
            Да
            <input type="radio" name="citizenship" value="yes" defaultChecked />
            <span className={styles.radioDot} aria-hidden="true" />
          </label>
          <label className={styles.radioCard}>
            Нет
            <input type="radio" name="citizenship" value="no" />
            <span className={styles.radioDot} aria-hidden="true" />
          </label>
        </fieldset>

        <label className={styles.legal} style={{ display: 'flex', gap: 12 }}>
          <input
            type="checkbox"
            style={{ width: 24, height: 24, accentColor: 'var(--tb-yellow)' }}
          />
          <span>
            Соглашаюсь получать рекламу про кэшбэк, повышенный процент и выгодные предложения
          </span>
        </label>

        <div className={styles.formFooter}>
          <p className={styles.legal}>
            Заполняя форму, я принимаю{' '}
            <a href="https://www.tbank.ru/about/">условия передачи информации</a> и использования
            карты до встречи
          </p>
          <Button type="submit">Продолжить</Button>
        </div>
      </form>
    </div>
  );
}
