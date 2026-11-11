// ponytail: CSS-модуль остаётся под прежним именем — стили ведёт другой человек.
import styles from './ResearcherBlocks.module.css';
import { Button } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

// Ряд карточек, который сам собирается в одну, две или три колонки.
const rowOfCards = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: 24,
} as const;

export interface Direction {
  id: string;
  title: string;
  text: string;
  image: string;
  cta: string;
  href: string;
}

export function DirectionCard({ direction }: { direction: Direction }) {
  return (
    <article className={styles.direction}>
      <h3 className={styles.directionTitle}>{direction.title}</h3>
      <p className={styles.directionText}>{direction.text}</p>
      <img className={styles.directionMedia} src={direction.image} alt="" loading="lazy" />
      <span className={styles.directionCta}>
        <Button variant="white" size="m" href={direction.href}>
          {direction.cta}
        </Button>
      </span>
    </article>
  );
}

export interface ResearchValue {
  id: string;
  title: string;
  text: string;
  image?: string;
  wide?: boolean;
}

export function ValuesGrid({ values }: { values: ResearchValue[] }) {
  return (
    <div className={styles.values}>
      {values.map((value) => (
        <article
          key={value.id}
          className={cx(styles.value, value.wide ? styles.valueWide : styles.valueNarrow)}
        >
          <div className={styles.valueContent}>
            <h3 className={styles.valueTitle}>{value.title}</h3>
            <p className={styles.valueText}>{value.text}</p>
          </div>
          {value.image && (
            <img className={styles.valueMedia} src={value.image} alt="" loading="lazy" />
          )}
        </article>
      ))}
    </div>
  );
}

export interface RecognitionItem {
  id: string;
  title: string;
  text: string;
}

export function Recognition({
  items,
  heroImage,
  bannerImage,
  bannerTitle = 'Открытая наука',
}: {
  items: RecognitionItem[];
  heroImage: string;
  bannerImage: string;
  bannerTitle?: string;
}) {
  return (
    <div>
      <div className={styles.awards}>
        <div className={styles.awardsList}>
          {items.map((item) => (
            <div key={item.id}>
              <h3 className={styles.awardTitle}>{item.title}</h3>
              <p className={styles.awardText}>{item.text}</p>
            </div>
          ))}
        </div>
        <img className={styles.awardsHero} src={heroImage} alt="" loading="lazy" />
      </div>
      <div className={styles.awardBanner}>
        <img src={bannerImage} alt="" loading="lazy" />
        <span className={styles.awardBannerTitle}>{bannerTitle}</span>
      </div>
    </div>
  );
}

export interface ResearchTrack {
  id: string;
  icon: IconName;
  title: string;
  text: string;
  cta: string;
  href: string;
  tone: 'gray' | 'accent';
}

export function StartCards({ cards }: { cards: ResearchTrack[] }) {
  return (
    <div style={rowOfCards}>
      {cards.map((card) => (
        <article
          key={card.id}
          className={cx(
            styles.track,
            card.tone === 'accent' ? styles.trackAccent : styles.trackGray
          )}
        >
          <Icon name={card.icon} size={32} style={{ marginBottom: 32 }} />
          <h3 className={styles.trackTitle}>{card.title}</h3>
          <p className={styles.trackText}>{card.text}</p>
          <span className={styles.trackCta}>
            <Button variant="white" size="m" href={card.href}>
              {card.cta}
            </Button>
          </span>
        </article>
      ))}
    </div>
  );
}

export interface Vacancy {
  id: string;
  icon: IconName;
  title: string;
  meta: string;
  text: string;
  cta: string;
  href: string;
}

export function VacancyCards({ vacancies }: { vacancies: Vacancy[] }) {
  return (
    <div style={rowOfCards}>
      {vacancies.map((vacancy) => (
        <article key={vacancy.id} className={cx(styles.track, styles.trackGray)}>
          <Icon name={vacancy.icon} size={32} style={{ marginBottom: 32 }} />
          <h3 className={styles.trackTitle}>{vacancy.title}</h3>
          <p
            className={styles.trackText}
            style={{
              marginTop: 4,
              font: '400 14px/20px var(--tb-font-text)',
              color: 'var(--tb-text-secondary)',
            }}
          >
            {vacancy.meta}
          </p>
          <p className={styles.trackText}>{vacancy.text}</p>
          <span className={styles.trackCta}>
            <Button variant="white" size="m" href={vacancy.href} iconRight="arrowRight">
              {vacancy.cta}
            </Button>
          </span>
        </article>
      ))}
    </div>
  );
}
