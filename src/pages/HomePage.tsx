import type { ReactNode } from 'react';
import styles from './HomePage.module.css';
import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { Button } from '../components/ui/Button';
import { CookieNotice } from '../components/ui/Feedback';
import { MediaPanel, ServiceCard } from '../components/prebuilt';
import { homeNav, products, researchPromos, services } from '../data/home';

function Section({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <div className="tb-container">
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <Header nav={homeNav} />

      <main>
        <section className={styles.hero}>
          <div className="tb-container">
            <div className={styles.heroInner}>
              <h1 className={styles.heroTitle}>
                Ассистент, который разбирает код и формулы вместе с вами
              </h1>
              <p className={styles.heroText}>Джупсик объясняет Java и Go</p>
              <div className={styles.actions}>
                <Button href="#/assistant">Открыть чат</Button>
              </div>
            </div>
          </div>
        </section>

        <Section title="Кому помогает Джупсик">
          <div className={styles.grid}>
            {products.map((product) => (
              <MediaPanel
                key={product.id}
                title={product.title}
                text={product.description}
                media={<img src={product.image} alt="" loading="lazy" />}
                links={[{ label: product.cta, href: product.href }]}
              />
            ))}
          </div>
        </Section>

        <Section title="Что умеет Джупсик">
          <div className={styles.gridThree}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.text}
                link={service.link}
              />
            ))}
          </div>
        </Section>

        <Section title="Разбор за вечер">
          <div className={styles.grid}>
            {researchPromos.map((promo) => (
              <MediaPanel
                key={promo.id}
                title={promo.title}
                text={promo.text}
                media={<img src={promo.image} alt="" loading="lazy" />}
                links={[{ label: promo.cta, href: promo.href }]}
              />
            ))}
          </div>
        </Section>

        <section className={styles.section}>
          <div className="tb-container">
            <MediaPanel
              title="Как разобрать чужой код за вечер"
              text="Блог Джус"
              media={<img src="/image.png" alt="" loading="lazy" />}
              links={[{ label: 'Читать', href: '#' }]}
            />
          </div>
        </section>
      </main>

      <Footer />

      <CookieNotice />
    </>
  );
}
