import styles from './HomeBlocks.module.css';
import { Button, TextLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
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

export interface QuickLink {
  label: string;
  href: string;
  icon: string;
  wide?: boolean;
}

export function QuickLinks({ items }: { items: QuickLink[] }) {
  return (
    <ul className={styles.quickList}>
      {items.map((item) => (
        <li key={item.label} className={item.wide ? styles.quickWide : undefined}>
          <a className={styles.quickItem} href={item.href} data-wide={item.wide || undefined}>
            <img src={item.icon} alt="" loading="lazy" />
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

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
        <Button variant="white" size="m" href={product.href}>
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
        <Button variant="white" size="m" href={href}>
          {cta}
        </Button>
      </span>
    </article>
  );
}

export interface TextCardProps {
  icon?: string;
  title: string;
  text: string;
  linkLabel: string;
  href: string;
  className?: string;
}

export function TextCard({ icon, title, text, linkLabel, href, className }: TextCardProps) {
  return (
    <article className={cx(styles.textCard, className)}>
      {icon && <img className={styles.textCardIcon} src={icon} alt="" loading="lazy" />}
      <h3 className={styles.textCardTitle}>{title}</h3>
      <p className={styles.textCardText}>{text}</p>
      <span className={styles.textCardLink}>
        <TextLink href={href}>{linkLabel}</TextLink>
      </span>
    </article>
  );
}

export function StatPanel({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <div className={styles.statPanel}>
      <div className={styles.statContent}>
        <img className={styles.statIcon} src="/images/tbank/app/icon.svg" alt="" />
        <h3 className={styles.statTitle}>{title}</h3>
        <p className={styles.statText}>{text}</p>
        <div className={styles.stores}>
          <a className={styles.store} href="https://www.tbank.ru/mobile-app/">
            <Icon name="android" size={20} />
            android
          </a>
          <a className={styles.store} href="https://www.tbank.ru/mobile-app/">
            <Icon name="apple" size={20} />
            iOS
          </a>
        </div>
      </div>
      <div className={styles.statMedia}>
        <img src={image} alt="Мобильное приложение Т-Банка" loading="lazy" />
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
