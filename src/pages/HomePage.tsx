import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { CookieNotice } from '../components/ui/Feedback';
import {
  ArticlesSection,
  Hero,
  JournalBanner,
  MoreSection,
  ProductsSection,
  ResearchPromoSection,
  ServicesSection,
  ShowcaseSection,
} from '../sections/HomeSections';
import {
  articles,
  homeNav,
  moreLinks,
  products,
  projectTemplates,
  researchPromos,
  reviewFormats,
  services,
} from '../data/home';

const hypothesisFormats = [
  { value: 'quick', label: 'Быстрый разбор' },
  { value: 'deep', label: 'Разбор с примерами кода' },
  { value: 'peer', label: 'С ревью команды' },
];

const dataFormats = [
  { value: 'task', label: 'Задача с интервью' },
  { value: 'proof', label: 'Доказательство по шагам' },
  { value: 'export', label: 'Выгрузка в Jupyter' },
];

export function HomePage() {
  return (
    <>
      <Header nav={homeNav} variant="home" />

      <main>
        <Hero
          title="Ассистент, который разбирает код и формулы вместе с вами"
          text="Джупсик объясняет Java и Go, раскладывает доказательства по шагам и показывает, откуда взялся каждый вывод в модели"
          cta="Открыть чат"
          href="#/assistant"
          image="/image.png"
          imageAlt="Команда разработчиков за работой"
        />

        <ShowcaseSection
          title="Соберите проект под свою задачу"
          tabs={[
            {
              id: 'review',
              label: 'Разбор кода',
              title: 'Разбор кода',
              designs: projectTemplates,
              options: reviewFormats,
            },
            {
              id: 'hypothesis',
              label: 'Алгоритмы',
              title: 'Алгоритмы и сложность',
              designs: projectTemplates,
              options: hypothesisFormats,
            },
            {
              id: 'data',
              label: 'Математика',
              title: 'Линейная алгебра и дискретка',
              designs: projectTemplates,
              options: dataFormats,
            },
          ]}
        />

        <ProductsSection
          title="Кому помогает Джупсик"
          groups={[products.slice(0, 2), products.slice(2)]}
        />

        <ServicesSection
          title="Что умеет Джупсик"
          cards={services}
          promos={[
            {
              title: 'Разбор за вечер',
              text: 'Ассистент соберёт объяснение темы с примерами на Java, Go и ссылками на документацию',
              image: '/image.png',
              cta: 'Попробовать',
              href: '#/assistant',
              tone: 'light',
            },
            {
              title: 'Граф зависимостей в проекте',
              text: 'Показывает, какой модуль на кого ссылается и где цикл мешает сборке',
              image: '/image.png',
              cta: 'Посмотреть',
              href: '#/assistant',
              tone: 'dark',
            },
          ]}
        />

        <ArticlesSection title="Из блога" articles={articles} moreHref="#" />

        <ResearchPromoSection title="Командам и группам" items={researchPromos} />

        <JournalBanner
          title="Как разобрать чужой код за вечер"
          source="Блог Джус"
          image="/image.png"
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
