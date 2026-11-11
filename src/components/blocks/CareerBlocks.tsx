import styles from './CareerBlocks.module.css';
import { Button } from '../ui/Button';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

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
      <img
        className={styles.directionMedia}
        src={direction.image}
        alt={direction.title}
        loading="lazy"
      />
      <span className={styles.directionCta}>
        <Button variant="white" size="m" href={direction.href}>
          {direction.cta}
        </Button>
      </span>
    </article>
  );
}

export interface CareerValue {
  id: string;
  title: string;
  text: string;
  image?: string;
  wide?: boolean;
}

export function ValuesGrid({ values }: { values: CareerValue[] }) {
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

export interface Award {
  id: string;
  title: string;
  text: string;
}

export function Awards({
  awards,
  heroImage,
  bannerImage,
}: {
  awards: Award[];
  heroImage: string;
  bannerImage: string;
}) {
  return (
    <div>
      <div className={styles.awards}>
        <div className={styles.awardsList}>
          {awards.map((award) => (
            <div key={award.id}>
              <h3 className={styles.awardTitle}>{award.title}</h3>
              <p className={styles.awardText}>{award.text}</p>
            </div>
          ))}
        </div>
        <img className={styles.awardsHero} src={heroImage} alt="Награды Т-Банка" loading="lazy" />
      </div>
      <div className={styles.awardBanner}>
        <img src={bannerImage} alt="" loading="lazy" />
        <span className={styles.awardBannerTitle}>Forbes</span>
      </div>
    </div>
  );
}

export interface CareerStartCard {
  id: string;
  icon: string;
  title: string;
  text: string;
  cta: string;
  href: string;
  tone: 'gray' | 'yellow';
}

export function StartCards({ cards }: { cards: CareerStartCard[] }) {
  return (
    <div className={styles.tracks}>
      {cards.map((card) => (
        <article
          key={card.id}
          className={cx(
            styles.track,
            card.tone === 'yellow' ? styles.trackYellow : styles.trackGray
          )}
        >
          <img className={styles.trackIcon} src={card.icon} alt="" loading="lazy" />
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
