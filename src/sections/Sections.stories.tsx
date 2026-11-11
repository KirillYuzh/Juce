import type { Meta, StoryObj } from '@storybook/react-vite';
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
} from './HomeSections';
import {
  DirectionsSection,
  FinalCtaSection,
  LearningSection,
  RecognitionSection,
  VacanciesSection,
  ValuesSection,
} from './ResearcherSections';
import { articles, moreLinks, products, quickLinks, researchPromos, services } from '../data/home';
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
      title="Ассистент, который читает статьи вместе с вами"
      text="Джупсик ищет источники, собирает обзор литературы и объясняет, откуда взялся каждый вывод"
      cta="Открыть чат"
      href="#/assistant"
      image="/images/wang/roof.png"
      imageAlt="Ассистент Джупсик: поиск, документы и проверка источников"
    />
  ),
};

export const QuickLinksSectionStory: Story = {
  name: 'Quick links',
  render: () => <QuickLinksSection items={quickLinks} />,
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
      title="12 400 исследователей уже работают в Джус"
      panel={{
        title: 'Джупсик в браузере',
        text: 'Откройте ассистента без установки: поиск, обзоры и ссылки работают прямо в браузере',
        image: '/images/wang/listen.png',
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
          title: 'Обзор за вечер',
          text: 'Ассистент соберёт черновик обзора по вашей теме с ссылками на каждый тезис',
          image: '/images/wang/roof.png',
          cta: 'Попробовать',
          href: '#/assistant',
        },
        {
          title: 'Граф связей между статьями',
          text: 'Показывает, кто на кого ссылается и где выводы расходятся',
          image: '/images/wang/smile.png',
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
  render: () => <ResearchPromoSection title="Лабораториям и группам" items={researchPromos} />,
};

export const Banner: Story = {
  render: () => (
    <JournalBanner
      title="Как собрать обзор литературы за вечер"
      source="Блог Джус"
      image="/images/wang/listen.png"
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
      title="Исследователям"
      text="Аспирантам, научным группам и лабораториям: обзор литературы, данные и ссылки в одном месте"
      cta="Начать исследование"
      href="#/researchers"
      image="/images/wang/roof.png"
      imageAlt="Платформа Джус для исследователей"
    />
  ),
};

export const ResearcherDirections: Story = {
  name: 'Researcher directions',
  render: () => <DirectionsSection directions={researcherDirections} />,
};

export const ResearcherValues: Story = {
  name: 'Researcher values',
  render: () => (
    <ValuesSection title="Как мы работаем с научным знанием" values={researcherValues} />
  ),
};

export const ResearcherRecognition: Story = {
  name: 'Researcher recognition',
  render: () => (
    <RecognitionSection
      title="Принципы, которые проверяем на себе"
      items={researcherAwards}
      heroImage="/images/wang/listen.png"
      bannerImage="/images/wang/laugh.jpeg"
      bannerTitle="Открытая наука"
    />
  ),
};

export const ResearcherLearning: Story = {
  name: 'Researcher learning',
  render: () => <LearningSection title="Обучение и стажировки" cards={researcherLearning} />,
};

export const ResearcherVacancies: Story = {
  name: 'Researcher vacancies',
  render: () => <VacanciesSection title="Открытые позиции" vacancies={researcherVacancies} />,
};

export const ResearcherCta: Story = {
  name: 'Researcher CTA',
  render: () => (
    <FinalCtaSection
      title="Начните исследование на платформе Джус"
      text="Ассистент поможет с обзором, данными и оформлением"
      cta="Создать проект"
      href="#/assistant"
    />
  ),
};
