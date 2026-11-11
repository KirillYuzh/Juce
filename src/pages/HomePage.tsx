import { Header } from '../components/blocks/Header';
import { Footer } from '../components/blocks/Footer';
import { CookieNotice } from '../components/ui/Feedback';
import {
  ArticlesSection,
  CareerPromoSection,
  CreditPromoSection,
  Hero,
  MoreSection,
  ProductsSection,
  QuickLinksSection,
  ServicesSection,
  ShowcaseSection,
  StatsSection,
} from '../sections/HomeSections';
import {
  articles,
  cardDesigns,
  careerPromos,
  homeNav,
  moreLinks,
  products,
  quickLinks,
  services,
} from '../data/home';

const cashbackOptions = [
  { value: 'all', label: 'Выберите повышенный кэшбэк (четыре категории)' },
  { value: 'travel', label: 'Путешествия' },
  { value: 'food', label: 'Кафе и рестораны' },
  { value: 'transport', label: 'Транспорт' },
];

export function HomePage() {
  return (
    <>
      <Header nav={homeNav} variant="home" />

      <main>
        <Hero
          title="Дебетовая карта, которую рекомендуют ваши друзья"
          text="Кэшбэк рублями до 30%, переводы клиентам Т-Банка без комиссии"
          cta="Оформить карту"
          href="https://www.tbank.ru/cards/debit-cards/"
          image="/images/tbank/hero/debit-card.png"
          imageAlt="Дебетовая карта Т-Банка"
        />

        <QuickLinksSection items={quickLinks} />

        <ShowcaseSection
          title="Управляйте финансами с выгодой в Т‑Банке"
          tabs={[
            {
              id: 'debit',
              label: 'Дебетовая карта',
              title: 'Дебетовая карта Black',
              designs: cardDesigns,
              cashbackOptions,
            },
            {
              id: 'credit',
              label: 'Кредитная карта',
              title: 'Кредитная карта «Платинум»',
              designs: cardDesigns,
              cashbackOptions,
            },
            {
              id: 'deposit',
              label: 'Вклад',
              title: 'Вклад с пополнением',
              designs: [],
              cashbackOptions: [
                { value: '6m', label: 'Срок вклада — 6 месяцев' },
                { value: '12m', label: 'Срок вклада — 12 месяцев' },
                { value: '24m', label: 'Срок вклада — 24 месяца' },
              ],
            },
          ]}
        />

        <ProductsSection
          title="Рекомендуемые продукты"
          groups={[products.slice(0, 2), products.slice(2)]}
        />

        <StatsSection
          title="Более 56 млн клиентов выбрали Т-Банк"
          panel={{
            title: 'Мобильное приложение Т-Банка',
            text: 'Проверяйте баланс, оплачивайте услуги, получайте помощь в чате 24/7',
            image: '/images/tbank/app/phone.png',
          }}
        />

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
              tone: 'light',
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

        <ArticlesSection
          title="Актуально сейчас"
          articles={articles}
          moreHref="https://www.tbank.ru/blog/"
        />

        <CareerPromoSection title="Работа и развитие" items={careerPromos} />

        <div style={{ marginTop: 48 }}>
          <CreditPromoSection />
        </div>

        <MoreSection title="Дополнительно" items={moreLinks} />
      </main>

      <div>
        <Footer variant="home" />
      </div>

      <CookieNotice />
    </>
  );
}
