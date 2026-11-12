import styles from './Sections.module.css';
import { Button } from '../components/ui/Button';
import { Section } from './HomeSections';
import {
  DirectionCard,
  Recognition,
  StartCards,
  VacancyCards,
  ValuesGrid,
  type Direction,
  type RecognitionItem,
  type ResearchTrack,
  type ResearchValue,
  type Vacancy,
} from '../components/blocks/ResearcherBlocks';

// Три направления не делятся на две колонки без пустого места в последнем ряду.
const rowOfCards = {
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
} as const;

export function DirectionsSection({
  title,
  directions,
}: {
  title?: string;
  directions: Direction[];
}) {
  return (
    <Section title={title}>
      <div className={styles.directions} style={rowOfCards}>
        {directions.map((direction) => (
          <DirectionCard key={direction.id} direction={direction} />
        ))}
      </div>
    </Section>
  );
}

export function ValuesSection({ title, values }: { title: string; values: ResearchValue[] }) {
  return (
    <Section title={title} className={styles.valuesSection}>
      <ValuesGrid values={values} />
    </Section>
  );
}

export function RecognitionSection({
  title,
  items,
  heroImage,
  bannerImage,
  bannerTitle,
}: {
  title: string;
  items: RecognitionItem[];
  heroImage: string;
  bannerImage: string;
  bannerTitle?: string;
}) {
  return (
    <Section title={title}>
      <Recognition
        items={items}
        heroImage={heroImage}
        bannerImage={bannerImage}
        bannerTitle={bannerTitle}
      />
    </Section>
  );
}

export function LearningSection({ title, cards }: { title: string; cards: ResearchTrack[] }) {
  return (
    <Section title={title}>
      <StartCards cards={cards} />
    </Section>
  );
}

export function VacanciesSection({ title, vacancies }: { title: string; vacancies: Vacancy[] }) {
  return (
    <Section title={title}>
      <VacancyCards vacancies={vacancies} />
    </Section>
  );
}

export function FinalCtaSection({
  title,
  text,
  cta,
  href,
}: {
  title: string;
  text?: string;
  cta: string;
  href: string;
}) {
  return (
    <Section title={title}>
      {text && (
        <p
          style={{
            maxWidth: 640,
            margin: '0 auto',
            textAlign: 'center',
            font: '400 17px/28px var(--tb-font-text)',
            color: 'var(--tb-text-secondary)',
          }}
        >
          {text}
        </p>
      )}
      <div className={styles.centeredAction}>
        <Button href={href} iconRight="arrowRight">
          {cta}
        </Button>
      </div>
    </Section>
  );
}
