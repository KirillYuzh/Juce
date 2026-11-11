import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArticlesSection,
  CareerPromoSection,
  Hero,
  MoreSection,
  ProductsSection,
  QuickLinksSection,
  ServicesSection,
  ShowcaseSection,
  StatsSection,
} from './HomeSections';
import {
  AwardsSection,
  CareerStartSection,
  DirectionsSection,
  VacancyCtaSection,
  ValuesSection,
} from './CareerSections';
import {
  articles,
  cardDesigns,
  careerPromos,
  moreLinks,
  products,
  quickLinks,
  services,
} from '../data/home';
import { careerAwards, careerDirections, careerStart, careerValues } from '../data/career';

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
      title="Дебетовая карта, которую рекомендуют ваши друзья"
      text="Кэшбэк рублями до 30%, переводы клиентам Т-Банка без комиссии"
      cta="Оформить карту"
      href="https://www.tbank.ru/cards/debit-cards/"
      image="/images/tbank/hero/debit-card.png"
      imageAlt="Дебетовая карта Т-Банка"
    />
  ),
};

export const QuickLinksSectionStory: Story = {
  name: 'Quick links',
  render: () => <QuickLinksSection items={quickLinks} />,
};

export const Showcase: Story = {
  render: () => (
    <ShowcaseSection
      title="Управляйте финансами с выгодой в Т‑Банке"
      tabs={[
        {
          id: 'debit',
          label: 'Дебетовая карта',
          title: 'Дебетовая карта Black',
          designs: cardDesigns,
          cashbackOptions: [{ value: 'all', label: 'Выберите повышенный кэшбэк (четыре категории)' }],
        },
      ]}
    />
  ),
};

export const Products: Story = {
  render: () => (
    <ProductsSection
      title="Рекомендуемые продукты"
      groups={[products.slice(0, 2), products.slice(2)]}
    />
  ),
};

export const Stats: Story = {
  render: () => (
    <StatsSection
      title="Более 56 млн клиентов выбрали Т-Банк"
      panel={{
        title: 'Мобильное приложение Т-Банка',
        text: 'Проверяйте баланс, оплачивайте услуги, получайте помощь в чате 24/7',
        image: '/images/tbank/app/phone.png',
      }}
    />
  ),
};

export const Services: Story = {
  render: () => (
    <ServicesSection
      title="Сервисы и услуги"
      cards={services}
      promos={[
        {
          title: 'Приведи друга',
          text: 'До 10 000 ₽ за рекомендации друзьям',
          image: '/images/tbank/services/friend.png',
          cta: 'Подробнее',
          href: 'https://www.tbank.ru/bring-friend/',
        },
        {
          title: 'T‑Pay — оплата в одно касание',
          text: 'Всё как вы привыкли: легко, надежно и с сохранением кэшбэка',
          image: '/images/tbank/services/tpay.png',
          cta: 'Попробовать',
          href: 'https://www.tbank.ru/tpay/',
          tone: 'dark',
        },
      ]}
    />
  ),
};

export const Articles: Story = {
  render: () => (
    <ArticlesSection title="Актуально сейчас" articles={articles} moreHref="https://www.tbank.ru/blog/" />
  ),
};

export const CareerPromo: Story = {
  name: 'Career promo',
  render: () => <CareerPromoSection title="Работа и развитие" items={careerPromos} />,
};

export const More: Story = {
  render: () => <MoreSection title="Дополнительно" items={moreLinks} />,
};

export const CareerHero: Story = {
  name: 'Hero — career',
  render: () => (
    <Hero
      title="Работа в Т-Банке"
      text="Развивайте продукты, двигайте технологии вперед и помогайте клиентам. У нас можно видеть результат своей работы и расти вместе с Т-Командой"
      cta="Выбрать вакансию"
      href="https://www.tbank.ru/career/vacancies/"
    />
  ),
};

export const CareerDirections: Story = {
  name: 'Career directions',
  render: () => <DirectionsSection directions={careerDirections} />,
};

export const CareerValues: Story = {
  name: 'Career values',
  render: () => (
    <ValuesSection title="У нас разные роли — и общий подход к работе" values={careerValues} />
  ),
};

export const CareerAwards: Story = {
  name: 'Career awards',
  render: () => (
    <AwardsSection
      title="Т-Банк — среди лучших работодателей"
      awards={careerAwards}
      heroImage="/images/tbank/career/awards-hero.png"
      bannerImage="/images/tbank/career/award-forbes.png"
    />
  ),
};

export const CareerStart: Story = {
  name: 'Career start',
  render: () => <CareerStartSection title="Начните карьеру в Т-Банке" cards={careerStart} />,
};

export const CareerVacancyCta: Story = {
  name: 'Career vacancy CTA',
  render: () => (
    <VacancyCtaSection
      title="Найдите ту самую вакансию"
      cta="Выбрать вакансию"
      href="https://www.tbank.ru/career/vacancies/"
    />
  ),
};
