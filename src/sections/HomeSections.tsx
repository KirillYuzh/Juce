import type { ReactNode } from 'react';
import styles from './Sections.module.css';
import { Button } from '../components/ui/Button';
import {
  ProductCard,
  PromoCard,
  QuickLinks,
  StatPanel,
  TextCard,
  WideBanner,
  type QuickLink,
  type PromoCardProps,
  type StatPanelLink,
} from '../components/blocks/HomeBlocks';
import type { IconName } from '../components/ui/icons';
import type { Product } from '../data/home';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

export function Section({
  title,
  children,
  className,
  id,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cx(styles.section, className)} id={id}>
      <div className="tb-container">
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export function Hero({
  title,
  text,
  cta,
  href,
  image,
  imageAlt = '',
}: {
  title: string;
  text: string;
  cta: string;
  href: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className={styles.hero}>
      <div className="tb-container">
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroText}>{text}</p>
          <Button href={href}>{cta}</Button>
          {image && (
            <div className={styles.heroMedia}>
              <img src={image} alt={imageAlt} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function QuickLinksSection({ items }: { items: QuickLink[] }) {
  return (
    <section>
      <div className="tb-container">
        <QuickLinks items={items} />
      </div>
    </section>
  );
}

export function ProductsSection({
  title,
  products,
  groups,
}: {
  title: string;
  products?: Product[];
  groups?: Product[][];
}) {
  const rows = groups ?? [products ?? []];
  return (
    <Section title={title}>
      {rows.map((row, index) => (
        <div
          className={styles.productsGrid}
          key={row.map((product) => product.id).join('-') || index}
        >
          {row.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ))}
    </Section>
  );
}

export function StatsSection({
  title,
  panel,
}: {
  title: string;
  panel: {
    title: string;
    text: string;
    image: string;
    links: StatPanelLink[];
  };
}) {
  return (
    <Section title={title}>
      <StatPanel {...panel} />
    </Section>
  );
}

export function ServicesSection({
  title,
  cards,
  promos,
}: {
  title: string;
  cards: Array<{
    id: string;
    icon: IconName;
    title: string;
    text: string;
    link: { label: string; href: string };
  }>;
  promos: PromoCardProps[];
}) {
  return (
    <Section title={title}>
      <div className={styles.threeCol}>
        {cards.map((card) => (
          <TextCard
            key={card.id}
            icon={card.icon}
            title={card.title}
            text={card.text}
            linkLabel={card.link.label}
            href={card.link.href}
          />
        ))}
      </div>
      <div className={styles.promos} style={{ marginTop: 24 }}>
        {promos.map((promo) => (
          <PromoCard key={promo.title} {...promo} />
        ))}
      </div>
    </Section>
  );
}

export function ArticlesSection({
  title,
  articles,
  moreHref,
}: {
  title: string;
  articles: Array<{ id: string; title: string; text: string; href: string }>;
  moreHref: string;
}) {
  return (
    <Section title={title}>
      <div className={styles.threeCol}>
        {articles.map((article) => (
          <TextCard
            key={article.id}
            title={article.title}
            text={article.text}
            linkLabel="Читать"
            href={article.href}
          />
        ))}
      </div>
      <div className={styles.centeredAction}>
        <Button variant="outline" size="m" href={moreHref}>
          Больше статей
        </Button>
      </div>
    </Section>
  );
}

export function ResearchPromoSection({
  title,
  items,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    text: string;
    image: string;
    cta: string;
    href: string;
  }>;
}) {
  return (
    <Section title={title}>
      <div className={styles.promos}>
        {items.map((item) => (
          <PromoCard
            key={item.id}
            title={item.title}
            text={item.text}
            image={item.image}
            cta={item.cta}
            href={item.href}
          />
        ))}
      </div>
    </Section>
  );
}

export function JournalBanner({
  title,
  source,
  image,
  cta,
  href,
}: {
  title: string;
  source: string;
  image: string;
  cta: string;
  href: string;
}) {
  return (
    <section>
      <div className="tb-container">
        <WideBanner title={title} source={source} image={image} cta={cta} href={href} />
      </div>
    </section>
  );
}

export function MoreSection({
  title,
  items,
}: {
  title: string;
  items: Array<{
    id: string;
    icon: IconName;
    title: string;
    text: string;
    link: { label: string; href: string };
  }>;
}) {
  return (
    <Section title={title}>
      <div className={styles.twoCol}>
        {items.map((item) => (
          <TextCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            text={item.text}
            linkLabel={item.link.label}
            href={item.link.href}
          />
        ))}
      </div>
    </Section>
  );
}
