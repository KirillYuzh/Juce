import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArticlesSection,
  Hero,
  JournalBanner,
  MoreSection,
  ProductsSection,
  ResearchPromoSection,
  ServicesSection,
  StatsSection,
} from './HomeSections';
import {
  DirectionsSection,
  FinalCtaSection,
  LearningSection,
  RecognitionSection,
  VacanciesSection,
  ValuesSection,
} from './ResearcherSections';
import { articles, moreLinks, products, researchPromos, services } from '../data/home';
import {
  researcherAwards,
  researcherDirections,
  researcherLearning,
  researcherValues,
  researcherVacancies,
} from '../data/researchers';

const meta: Meta = {
  title: 'Templates/Sections',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const HomeHero: Story = {
  name: 'Hero — home',
  render: () => (
    <Hero
      title="Ассистент, который разбирает код и формулы вместе с вами"
      text="Джупсик объясняет Java и Go, раскладывает доказательства по шагам и показывает, откуда взялся каждый вывод"
      cta="Открыть чат"
      href="#/assistant"
      image="/image.png"
      imageAlt="Ассистент Джупсик: разбор кода, алгоритмы и математика"
    />
  ),
};

export const Products: Story = {
  render: () => (
    <ProductsSection
      title="Кому помогает Джупсик"
      groups={[products.slice(0, 2), products.slice(2)]}
    />
  ),
};

export const Stats: Story = {
  render: () => (
    <StatsSection
      title="12 400 инженеров уже учатся в Джус"
      panel={{
        title: 'Джупсик в браузере',
        text: 'Откройте ассистента без установки: разбор кода, объяснения и тесты работают прямо в браузере',
        image: '/image.png',
        links: [
          { label: 'Открыть чат', href: '#/assistant', icon: 'globe' },
          { label: 'Документация', href: '#', icon: 'code' },
        ],
      }}
    />
  ),
};

export const Services: Story = {
  render: () => (
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
  ),
};

export const Articles: Story = {
  render: () => <ArticlesSection title="Из блога" articles={articles} moreHref="#" />,
};

export const ResearchPromo: Story = {
  name: 'Promo pair',
  render: () => <ResearchPromoSection title="Командам и группам" items={researchPromos} />,
};

export const Banner: Story = {
  render: () => (
    <JournalBanner
      title="Как разобрать чужой код за вечер"
      source="Блог Джус"
      image="/image.png"
      cta="Читать"
      href="#"
    />
  ),
};

export const More: Story = {
  render: () => <MoreSection title="Дополнительно" items={moreLinks} />,
};

export const ResearchersHero: Story = {
  name: 'Hero — researchers',
  render: () => (
    <Hero
      title="Разработчикам"
      text="Java-разработчикам, Go-командам и студентам: разборы кода, задачи и конспекты в одном месте"
      cta="Начать разбор"
      href="#/researchers"
      image="/image.png"
      imageAlt="Платформа Джус для разработчиков"
    />
  ),
};

export const ResearcherDirections: Story = {
  name: 'Developer directions',
  render: () => <DirectionsSection directions={researcherDirections} />,
};

export const ResearcherValues: Story = {
  name: 'Developer values',
  render: () => (
    <ValuesSection title="Как мы работаем с кодом и задачами" values={researcherValues} />
  ),
};

export const ResearcherRecognition: Story = {
  name: 'Developer recognition',
  render: () => (
    <RecognitionSection
      title="Принципы, которые проверяем на себе"
      items={researcherAwards}
      heroImage="/image.png"
      bannerImage="/image.png"
      bannerTitle="Открытый код"
    />
  ),
};

export const ResearcherLearning: Story = {
  name: 'Developer learning',
  render: () => <LearningSection title="Обучение и стажировки" cards={researcherLearning} />,
};

export const ResearcherVacancies: Story = {
  name: 'Developer vacancies',
  render: () => <VacanciesSection title="Открытые позиции" vacancies={researcherVacancies} />,
};

export const ResearcherCta: Story = {
  name: 'Developer CTA',
  render: () => (
    <FinalCtaSection
      title="Начните разбор на платформе Джус"
      text="Ассистент объяснит код, проверит доказательство и напишет тесты"
      cta="Создать проект"
      href="#/assistant"
    />
  ),
};
