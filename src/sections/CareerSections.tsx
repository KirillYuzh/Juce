import styles from './Sections.module.css';
import { Button } from '../components/ui/Button';
import { Section } from './HomeSections';
import {
  Awards,
  DirectionCard,
  StartCards,
  ValuesGrid,
  type Award,
  type CareerStartCard,
  type CareerValue,
  type Direction,
} from '../components/blocks/CareerBlocks';

export function DirectionsSection({ directions }: { directions: Direction[] }) {
  return (
    <section>
      <div className="tb-container">
        <div className={styles.directions}>
          {directions.map((direction) => (
            <DirectionCard key={direction.id} direction={direction} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ValuesSection({ title, values }: { title: string; values: CareerValue[] }) {
  return (
    <Section title={title} className={styles.valuesSection}>
      <ValuesGrid values={values} />
    </Section>
  );
}

export function AwardsSection({
  title,
  awards,
  heroImage,
  bannerImage,
}: {
  title: string;
  awards: Award[];
  heroImage: string;
  bannerImage: string;
}) {
  return (
    <Section title={title}>
      <Awards awards={awards} heroImage={heroImage} bannerImage={bannerImage} />
    </Section>
  );
}

export function CareerStartSection({ title, cards }: { title: string; cards: CareerStartCard[] }) {
  return (
    <Section title={title}>
      <StartCards cards={cards} />
    </Section>
  );
}

export function VacancyCtaSection({
  title,
  cta,
  href,
}: {
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <Section title={title}>
      <div className={styles.centeredAction}>
        <Button href={href}>{cta}</Button>
      </div>
    </Section>
  );
}
