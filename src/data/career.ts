import type { NavItem } from './home';

export const careerNav: NavItem[] = [
  { title: 'Вакансии', href: 'https://www.tbank.ru/career/vacancies/' },
  { title: 'О нас', href: 'https://www.tbank.ru/career/about/' },
  { title: 'Работа с клиентами', href: 'https://www.tbank.ru/career/service/' },
  { title: 'Работа в ИТ', href: 'https://www.tbank.ru/career/it/' },
];

export const careerDirections = [
  {
    id: 'clients',
    title: 'Работа с клиентами',
    text: 'Консультируйте по продуктам, проводите встречи или предлагайте варианты погашения задолженности',
    image: '/images/tbank/career/direction-clients.png',
    cta: 'Смотреть вакансии',
    href: 'https://www.tbank.ru/career/service/',
  },
  {
    id: 'it',
    title: 'Работа в ИТ',
    text: 'Пишите код, проектируйте системы или анализируйте данные — в ИТ много разных специализаций',
    image: '/images/tbank/career/direction-it.png',
    cta: 'Смотреть вакансии',
    href: 'https://www.tbank.ru/career/it/',
  },
];

export const careerValues = [
  {
    id: 'direct',
    title: 'Говорим прямо и по делу',
    text: 'Умеем задавать неудобные вопросы, открыто спорить и слышать коллег. У нас решают не должности, а результаты и умение отстаивать позицию',
    image: '/images/tbank/career/value-direct.png',
    wide: true,
  },
  {
    id: 'ideas',
    title: 'Превращаем идеи в улучшения',
    text: 'Не оставляем хорошие мысли в заметках — приносим идеи, дорабатываем их и проверяем на практике. Если подход не сработал, разбираемся почему и превращаем выводы в новую гипотезу',
  },
  {
    id: 'support',
    title: 'Поддерживаем друг друга',
    text: 'Подключаемся, если у коллег возникают трудности: обсуждаем ситуацию, делимся знаниями и ищем решение вместе. Когда свежий взгляд нужен нам самим, знаем, к кому обратиться',
  },
  {
    id: 'result',
    title: 'Влияем на результат',
    text: 'Видим, как наша работа меняет опыт клиентов и команды: где становится проще, удобнее или быстрее. Особенно ценно замечать эти изменения и понимать, что мы к ним причастны',
    image: '/images/tbank/career/value-result.png',
    wide: true,
  },
  {
    id: 'responsibility',
    title: 'Берем ответственность',
    text: 'Вовлекаемся в задачи, отстаиваем решения и не ограничиваем свободу действий. Каждый может повлиять на продукт и достичь результатов, которыми хочется гордиться',
    image: '/images/tbank/career/value-responsibility.png',
    wide: true,
  },
  {
    id: 'together',
    title: 'Растем вместе',
    text: 'Беремся за новое, учимся у других и помогаем освоить то, в чем уже разобрались сами. Со временем сложные задачи становятся привычнее, а в профессии появляется больше уверенности',
  },
];

export const careerAwards = [
  {
    id: 'future-today',
    title: 'Future Today',
    text: 'Стали одним из трех самых привлекательных работодателей для студентов в 2025 году',
  },
  {
    id: 'forbes-platinum',
    title: 'Forbes',
    text: 'Получили три Платины — максимальный результат в рейтинге работодателей 2025 года',
  },
  {
    id: 'rbc',
    title: 'РБК',
    text: 'Заняли место в первой, наивысшей группе рейтинга работодателей в 2025 году',
  },
  {
    id: 'forbes-youth',
    title: 'Forbes',
    text: 'Вошли в платиновую категорию рейтинга лучших работодателей для молодежи в 2026 году',
  },
];

export const careerStart = [
  {
    id: 'internships',
    icon: '/images/tbank/career/internships.svg',
    title: 'Стажировки и программы',
    text: 'Пробуйте себя в ИТ или других направлениях: применяйте знания на практике и получайте первый опыт',
    cta: 'Подробнее',
    href: 'https://www.tbank.ru/career/vacancies/internship/',
    tone: 'gray' as const,
  },
  {
    id: 'no-experience',
    icon: '/images/tbank/career/no-experience.svg',
    title: 'Вакансии без опыта',
    text: 'На старте познакомитесь с продуктами, а команда поможет освоиться',
    cta: 'Подробнее',
    href: 'https://www.tbank.ru/career/vacancies/no-experience/',
    tone: 'yellow' as const,
  },
];

export const careerFooterLinks = [
  'О нас',
  'Вакансии',
  'Работа с клиентами',
  'Вакансии представителей Т-Банка',
  'Вакансии удаленной работы',
  'Вакансии менеджеров по продажам',
  'Работа в ИТ',
  'ИТ Интервью',
  'Наши технологии',
  'Бизнес и процессы',
  'Приведи друга',
  'Отзывы',
  'Блог',
  'FAQ',
];
