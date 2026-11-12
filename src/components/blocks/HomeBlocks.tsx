import styles from './HomeBlocks.module.css';
import { Button, TextLink } from '../ui/Button';
import { Icon, type IconName } from '../ui/Icon';
import type { Product } from '../../data/home';

const cx = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

const toneClass: Record<Product['tone'], string> = {
  dark: styles.productDark,
  steel: styles.productSteel,
  lavender: styles.productLavender,
  ice: styles.productIce,
  mint: styles.productMint,
  sand: styles.productSand,
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article
      className={cx(
        styles.product,
        product.size === 'large' ? styles.productLarge : styles.productSmall,
        toneClass[product.tone]
      )}
    >
      <h3 className={styles.productTitle}>{product.title}</h3>
      {product.description && <p className={styles.productDescription}>{product.description}</p>}
      <img className={styles.productMedia} src={product.image} alt="" loading="lazy" />
      <span className={styles.productCta}>
        <Button variant="primary" size="m" href={product.href}>
          {product.cta}
        </Button>
      </span>
    </article>
  );
}

export interface PromoCardProps {
  title: string;
  text: string;
  image: string;
  cta: string;
  href: string;
  tone?: 'light' | 'dark';
}

export function PromoCard({ title, text, image, cta, href, tone = 'light' }: PromoCardProps) {
  return (
    <article className={cx(styles.promo, tone === 'dark' ? styles.promoDark : styles.promoLight)}>
      <h3 className={styles.promoTitle}>{title}</h3>
      <p className={styles.promoText}>{text}</p>
      <img className={styles.promoMedia} src={image} alt="" loading="lazy" />
      <span className={styles.promoCta}>
        <Button variant="primary" size="m" href={href}>
          {cta}
        </Button>
      </span>
    </article>
  );
}

export interface TextCardProps {
  title: string;
  text: string;
  linkLabel: string;
  href: string;
  className?: string;
}

export function TextCard({ title, text, linkLabel, href, className }: TextCardProps) {
  return (
    <article className={cx(styles.textCard, className)}>
      <h3 className={styles.textCardTitle}>{title}</h3>
      <p className={styles.textCardText}>{text}</p>
      <span className={styles.textCardLink}>
        <TextLink href={href}>{linkLabel}</TextLink>
      </span>
    </article>
  );
}

export interface StatPanelLink {
  label: string;
  href: string;
  icon: IconName;
}

export function StatPanel({
  title,
  text,
  image,
  links,
}: {
  title: string;
  text: string;
  image: string;
  links: StatPanelLink[];
}) {
  return (
    <div className={styles.statPanel}>
      <div className={styles.statContent}>
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statText}>{text}</p>
        <div className={styles.stores}>
          {links.map((link) => (
            <a className={styles.store} key={link.label} href={link.href}>
              <Icon name={link.icon} size={20} />
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.statMedia}>
        <img src={image} alt="" loading="lazy" />
      </div>
    </div>
  );
}

export function WideBanner({
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
    <article className={styles.banner}>
      <img className={styles.bannerMedia} src={image} alt="" loading="lazy" />
      <div className={styles.bannerContent}>
        <h2 className={styles.bannerTitle}>{title}</h2>
        <span className={styles.bannerSource}>{source}</span>
      </div>
      <span className={styles.bannerCta}>
        <Button variant="white" size="m" href={href}>
          {cta}
        </Button>
      </span>
    </article>
  );
}
