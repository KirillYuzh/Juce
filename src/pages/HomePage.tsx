import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { CookieNotice } from '../components/ui/Feedback';
import {
  ArticlesSection,
  Hero,
  JournalBanner,
  MoreSection,
  ProductsSection,
  QuickLinksSection,
  ResearchPromoSection,
  ServicesSection,
  StatsSection,
} from '../sections/HomeSections';
import {
  articles,
  homeNav,
  moreLinks,
  products,
  quickLinks,
  researchPromos,
  services,
} from '../data/home';

export function HomePage() {
  return (
    <>
      <Header nav={homeNav} variant="home" />

      <main>
        <Hero
          title="Ассистент, который читает статьи вместе с вами"
          text="Джупсик ищет источники, собирает обзор литературы и объясняет, откуда взялся каждый вывод"
          cta="Открыть чат"
          href="#/assistant"
          image="/images/juce/hero.png"
          imageAlt="Ассистент Джупсик: поиск, документы и проверка источников"
        />

        <QuickLinksSection items={quickLinks} />

        <ProductsSection
          title="Кому помогает Джупсик"
          groups={[products.slice(0, 2), products.slice(2)]}
        />

        <StatsSection
          title="12 400 исследователей уже работают в Джус"
          panel={{
            title: 'Джупсик в браузере',
            text: 'Откройте ассистента без установки: поиск, обзоры и ссылки работают прямо в браузере',
            image: '/images/juce/app.png',
            links: [
              { label: 'Открыть чат', href: '#/assistant', icon: 'globe' },
              { label: 'Документация', href: '#', icon: 'code' },
            ],
          }}
        />

        <ServicesSection
          title="Что умеет Джупсик"
          cards={services}
          promos={[
            {
              title: 'Обзор за вечер',
              text: 'Ассистент соберёт черновик обзора по вашей теме с ссылками на каждый тезис',
              image: '/images/juce/promo-1.png',
              cta: 'Попробовать',
              href: '#/assistant',
              tone: 'light',
            },
            {
              title: 'Граф связей между статьями',
              text: 'Показывает, кто на кого ссылается и где выводы расходятся',
              image: '/images/juce/promo-2.png',
              cta: 'Посмотреть',
              href: '#/assistant',
              tone: 'dark',
            },
          ]}
        />

        <ArticlesSection title="Из блога" articles={articles} moreHref="#" />

        <ResearchPromoSection title="Лабораториям и группам" items={researchPromos} />

        <JournalBanner
          title="Как собрать обзор литературы за вечер"
          source="Блог Джус"
          image="/images/juce/banner.png"
          cta="Читать"
          href="#"
        />

        <MoreSection title="Дополнительно" items={moreLinks} />
      </main>

      <div>
        <Footer />
      </div>

      <CookieNotice />
    </>
  );
}
