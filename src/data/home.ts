export interface NavItem {
  title: string;
  href: string;
  children?: Array<{ title: string; href: string }>;
}

export const homeNav: NavItem[] = [
  {
    title: 'Частным лицам',
    href: '#',
    children: [
      { title: 'Дебетовые карты', href: 'https://www.tbank.ru/cards/debit-cards/' },
      { title: 'Кредитные карты', href: 'https://www.tbank.ru/cards/credit-cards/' },
      { title: 'Вклады', href: 'https://www.tbank.ru/savings/deposit/' },
      { title: 'Кредиты и ипотека', href: 'https://www.tbank.ru/loans/' },
      { title: 'Инвестиции', href: 'https://www.tbank.ru/invest/' },
      { title: 'Страхование', href: 'https://www.tbank.ru/insurance/' },
      { title: 'Путешествия', href: 'https://www.tbank.ru/travel/' },
      { title: 'Мобильная связь', href: 'https://www.tbank.ru/mobile-operator/' },
    ],
  },
  {
    title: 'Бизнесу',
    href: '#',
    children: [
      { title: 'Расчетный счет', href: 'https://www.tbank.ru/business/account/' },
      { title: 'Бизнес-карта', href: 'https://www.tbank.ru/business/cards/' },
      { title: 'Кредиты для бизнеса', href: 'https://www.tbank.ru/business/credit/' },
      { title: 'Эквайринг', href: 'https://www.tbank.ru/business/acquiring/' },
      { title: 'Зарплатный проект', href: 'https://www.tbank.ru/business/salary/' },
      { title: 'Бухгалтерия', href: 'https://www.tbank.ru/business/accounting/' },
    ],
  },
  {
    title: 'Премиум',
    href: '#',
    children: [
      { title: 'Premium', href: 'https://www.tbank.ru/premium/' },
      { title: 'Private', href: 'https://www.tbank.ru/private/' },
      { title: 'Инвестиции', href: 'https://www.tbank.ru/invest/' },
      { title: 'Лайфстайл', href: 'https://www.tbank.ru/premium/lifestyle/' },
    ],
  },
  {
    title: 'Ещё',
    href: '#',
    children: [
      { title: 'Курсы валют', href: 'https://www.tbank.ru/about/currency/' },
      { title: 'Банкоматы', href: 'https://www.tbank.ru/about/atm/' },
      { title: 'T-Pay', href: 'https://www.tbank.ru/tpay/' },
      { title: 'Биометрия', href: 'https://www.tbank.ru/about/biometrics/' },
      { title: 'Помощь', href: 'https://www.tbank.ru/help/' },
      { title: 'Работа в Т-Банке', href: 'https://www.tbank.ru/career/' },
    ],
  },
];

export const quickLinks = [
  {
    label: 'Дебетовые карты',
    href: 'https://www.tbank.ru/cards/debit-cards/',
    icon: '/images/tbank/icons/debit-cards.png',
  },
  {
    label: 'Кредитные карты',
    href: 'https://www.tbank.ru/cards/credit-cards/',
    icon: '/images/tbank/icons/credit-cards.png',
  },
  {
    label: 'Кредиты',
    href: 'https://www.tbank.ru/loans/',
    icon: '/images/tbank/icons/credits.png',
  },
  {
    label: 'Premium',
    href: 'https://www.tbank.ru/premium/',
    icon: '/images/tbank/icons/premium.png',
  },
  {
    label: 'Вклады',
    href: 'https://www.tbank.ru/savings/deposit/',
    icon: '/images/tbank/icons/deposits.png',
  },
  {
    label: 'Инвестиции',
    href: 'https://www.tbank.ru/invest/',
    icon: '/images/tbank/icons/investments.png',
  },
  {
    label: 'Сим-карта',
    href: 'https://www.tbank.ru/mobile-operator/sim/',
    icon: '/images/tbank/icons/sim.png',
  },
  {
    label: 'Страхование',
    href: 'https://www.tbank.ru/insurance/',
    icon: '/images/tbank/icons/insurance.png',
  },
  {
    label: 'Путешествия',
    href: 'https://www.tbank.ru/travel/',
    icon: '/images/tbank/icons/travel.png',
  },
  {
    label: 'Всё для бизнеса',
    href: 'https://www.tbank.ru/business/',
    icon: '/images/tbank/icons/business.png',
    wide: true,
  },
];

export interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  cta: string;
  href: string;
  tone: 'dark' | 'steel' | 'lavender' | 'ice' | 'mint' | 'sand';
  size: 'large' | 'small';
}

export const products: Product[] = [
  {
    id: 'credit-card',
    title: 'Кредитная карта «Платинум»',
    description: 'До 1 000 000 ₽ на любые покупки и 120 дней без процентов',
    image: '/images/tbank/products/credit-card.png',
    cta: 'Оформить карту',
    href: 'https://www.tbank.ru/cards/credit-cards/',
    tone: 'steel',
    size: 'large',
  },
  {
    id: 'investments',
    title: 'Т‑Инвестиции',
    description: 'Понятные тарифы и удобное приложение',
    image: '/images/tbank/products/investments.png',
    cta: 'Стать инвестором',
    href: 'https://www.tbank.ru/invest/',
    tone: 'ice',
    size: 'large',
  },
  {
    id: 'mobile',
    title: 'Хватит на всё с Т‑Мобайлом',
    description: '50 ГБ и 1 200 минут за 390 ₽ в месяц',
    image: '/images/tbank/products/mobile.png',
    cta: 'Оформить сим-карту',
    href: 'https://www.tbank.ru/mobile-operator/',
    tone: 'lavender',
    size: 'small',
  },
  {
    id: 'deposit',
    title: 'Вклады',
    description:
      'Откройте вклад с пополнением и частичным изъятием. Каждый месяц получайте проценты на карту или вклад',
    image: '/images/tbank/products/deposit.png',
    cta: 'Открыть вклад',
    href: 'https://www.tbank.ru/savings/deposit/',
    tone: 'ice',
    size: 'small',
  },
  {
    id: 'osago',
    title: 'Страхование ОСАГО',
    description: 'Электронный полис с онлайн-калькулятором и скидками (КБМ) за безаварийность',
    image: '/images/tbank/products/osago.png',
    cta: 'Рассчитать стоимость',
    href: 'https://www.tbank.ru/insurance/osago/',
    tone: 'mint',
    size: 'small',
  },
];

export const cardDesigns = [
  { id: 'black', image: '/images/tbank/card-designs/black.png', label: 'Чёрная' },
  { id: 'night', image: '/images/tbank/card-designs/night.png', label: 'Ночная поездка' },
  { id: 'sailboat', image: '/images/tbank/card-designs/sailboat.png', label: 'Парусник' },
  { id: 'lake', image: '/images/tbank/card-designs/lake.png', label: 'Озеро' },
  { id: 'desert', image: '/images/tbank/card-designs/desert.png', label: 'Пустыня' },
  { id: 'palms', image: '/images/tbank/card-designs/palms.png', label: 'Пальмы' },
];

export const services = [
  {
    id: 'currency',
    icon: '/images/tbank/services/currency.svg',
    title: 'Курсы валют',
    text: 'Перевод между своими счетами, оплата услуг и снятие наличных в сервисах Т-Банка',
    link: { label: 'Смотреть', href: 'https://www.tbank.ru/about/currency/' },
  },
  {
    id: 'cash',
    icon: '/images/tbank/services/cash.svg',
    title: 'Снятие наличных',
    text: 'В банкоматах Т-Банка без комиссии. И без карты, если у вас смартфон',
    link: { label: 'Найти банкомат', href: 'https://www.tbank.ru/about/atm/' },
  },
  {
    id: 'transfers',
    icon: '/images/tbank/services/transfers.svg',
    title: 'Переводы и пополнения',
    text: 'С карты на карту или на счет Т-Банка',
    link: { label: 'Пополнить или перевести', href: 'https://www.tbank.ru/transfer/' },
  },
];

export const articles = [
  {
    id: 'tax',
    title: 'Как рассчитать налог на доход по вкладам',
    text: 'И кому нужно уплатить его в 2026 году',
    href: 'https://journal.tinkoff.ru/',
  },
  {
    id: 'deduction',
    title: 'Как получить налоговый вычет по ПДС',
    text: 'Рассказываем, как вернуть часть вложенных денег',
    href: 'https://journal.tinkoff.ru/',
  },
  {
    id: 'million',
    title: 'Разыгрываем 1 000 000 ₽',
    text: 'Для участия в акции оформите страховку на квартиру или дом до 30 ноября',
    href: 'https://www.tbank.ru/',
  },
];

export const careerPromos = [
  {
    id: 'vacancies',
    title: 'Вакансии',
    text: 'В вашем или любом другом городе',
    image: '/images/tbank/career/vacancies.png',
    cta: 'Смотреть вакансии',
    href: 'https://www.tbank.ru/career/vacancies/',
  },
  {
    id: 'education',
    title: 'Т‑Образование',
    text: 'Учебные курсы и оплачиваемые программы развития',
    image: '/images/tbank/career/education.png',
    cta: 'Подробнее',
    href: 'https://www.tbank.ru/education/',
  },
];

export const moreLinks = [
  {
    id: 'help',
    icon: '/images/tbank/more/help.svg',
    title: 'Помощь',
    text: 'Отвечаем на вопросы по всем продуктам',
    link: { label: 'Подробнее', href: 'https://www.tbank.ru/help/' },
  },
  {
    id: 'reviews',
    icon: '/images/tbank/more/reviews.svg',
    title: 'Т-Банк Отзывы',
    text: 'Выбирайте продукты Т-Банк, магазины, рестораны, сервисы и бренды на основе реальных отзывов',
    link: { label: 'Подробнее', href: 'https://www.tbank.ru/reviews/' },
  },
];
