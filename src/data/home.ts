import type { IconName } from '../components/ui/icons';

export interface NavItem {
  title: string;
  href: string;
  children?: Array<{ title: string; href: string }>;
}

export const homeNav: NavItem[] = [
  {
    title: 'Платформа',
    href: '#',
    children: [
      { title: 'Ассистент Джупсик', href: '#/assistant' },
      { title: 'Поиск по статьям', href: '#' },
      { title: 'Обзоры литературы', href: '#' },
      { title: 'Датасеты и код', href: '#' },
      { title: 'Проверка гипотез', href: '#' },
      { title: 'Оформление ссылок', href: '#' },
    ],
  },
  {
    title: 'Исследователям',
    href: '#/researchers',
    children: [
      { title: 'Аспирантам', href: '#/researchers' },
      { title: 'Научным группам', href: '#/researchers' },
      { title: 'Лабораториям', href: '#/researchers' },
      { title: 'Стажировки', href: '#/researchers' },
      { title: 'Гранты', href: '#/researchers' },
    ],
  },
  {
    title: 'Публикации',
    href: '#',
    children: [
      { title: 'Каталог препринтов', href: '#' },
      { title: 'Мои подборки', href: '#' },
      { title: 'Рецензии', href: '#' },
      { title: 'Метрики и цитирования', href: '#' },
    ],
  },
  {
    title: 'Ещё',
    href: '#',
    children: [
      { title: 'Документация', href: '#' },
      { title: 'API платформы', href: '#' },
      { title: 'Помощь', href: '#' },
      { title: 'О платформе', href: '#' },
    ],
  },
];

export const quickLinks = [
  { label: 'Найти статью', href: '#', icon: 'search' },
  { label: 'Собрать обзор', href: '#', icon: 'doc' },
  { label: 'Проверить гипотезу', href: '#', icon: 'checkCircle' },
  { label: 'Датасеты', href: '#', icon: 'globe' },
  { label: 'Оформить ссылки', href: '#', icon: 'quote' },
  { label: 'Дедлайны грантов', href: '#/researchers', icon: 'calendar', wide: true },
] satisfies Array<{ label: string; href: string; icon: IconName; wide?: boolean }>;

export interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  cta: string;
  href: string;
  size: 'large' | 'small';
  tone: 'dark' | 'steel' | 'lavender' | 'ice' | 'mint' | 'sand';
}

export const products: Product[] = [
  {
    id: 'phd',
    title: 'Аспирантам',
    description: 'Первый обзор литературы, оформление ссылок и разбор чужих методов',
    image: '/images/juce/audience-1.png',
    cta: 'Начать',
    href: '#/researchers',
    size: 'large',
    tone: 'ice',
  },
  {
    id: 'groups',
    title: 'Научным группам',
    description: 'Общая библиотека, заметки и проверка гипотез',
    image: '/images/juce/audience-2.png',
    cta: 'Подробнее',
    href: '#/researchers',
    size: 'large',
    tone: 'sand',
  },
  {
    id: 'labs',
    title: 'Лабораториям',
    description: 'Доступ к датасетам и воспроизводимые эксперименты',
    image: '/images/juce/audience-3.png',
    cta: 'Подробнее',
    href: '#/researchers',
    size: 'small',
    tone: 'steel',
  },
  {
    id: 'libraries',
    title: 'Библиотекам',
    description: 'Подписки, каталоги и помощь с поиском источников',
    image: '/images/juce/audience-4.png',
    cta: 'Подробнее',
    href: '#/researchers',
    size: 'small',
    tone: 'dark',
  },
];

export const services = [
  {
    id: 'search',
    icon: 'search',
    title: 'Поиск по 48 млн статей',
    text: 'Находит препринты и рецензируемые работы, отбрасывает нерелевантное и показывает, почему выбрал источник.',
    link: { label: 'Попробовать', href: '#/assistant' },
  },
  {
    id: 'review',
    icon: 'doc',
    title: 'Обзор литературы',
    text: 'Собирает обзор по теме: выделяет методы, выборки и противоречия, оставляет ссылки на каждый тезис.',
    link: { label: 'Как это работает', href: '#' },
  },
  {
    id: 'cite',
    icon: 'quote',
    title: 'Ссылки и цитирование',
    text: 'Оформляет библиографию по ГОСТ, APA и Vancouver, проверяет, что источник действительно существует.',
    link: { label: 'Стандарты', href: '#' },
  },
] satisfies Array<{
  id: string;
  icon: IconName;
  title: string;
  text: string;
  link: { label: string; href: string };
}>;

export const articles = [
  {
    id: 'review',
    title: 'Как Джупсик ищет противоречия в литературе',
    text: 'Разбираем, что ассистент считает конфликтом результатов и как показывает свою уверенность.',
    href: '#',
  },
  {
    id: 'repro',
    title: 'Воспроизводимость: чек-лист для статьи',
    text: 'Двенадцать пунктов, которые стоит закрыть до отправки рукописи в журнал.',
    href: '#',
  },
  {
    id: 'data',
    title: 'Датасеты, которым можно доверять',
    text: 'Как мы проверяем лицензии, версии и происхождение данных в каталоге.',
    href: '#',
  },
];

export const researchPromos = [
  {
    id: 'lab',
    title: 'Лабораториям и группам',
    text: 'Общая библиотека источников, заметки и история запросов для всей команды',
    image: '/images/juce/researchers-1.png',
    cta: 'Подключить группу',
    href: '#/researchers',
  },
  {
    id: 'grants',
    title: 'Грантовая мастерская',
    text: 'Помощь с обзором литературы для заявки и списком литературы по требованиям фонда',
    image: '/images/juce/researchers-3.png',
    cta: 'Узнать больше',
    href: '#/researchers',
  },
];

export const moreLinks = [
  {
    id: 'api',
    icon: 'code',
    title: 'API платформы',
    text: 'Подключите поиск и ассистента к своим инструментам: REST, вебхуки, экспорт в LaTeX.',
    link: { label: 'Документация', href: '#' },
  },
  {
    id: 'ethics',
    icon: 'shield',
    title: 'Этика и данные',
    text: 'Как мы храним запросы, что попадает в модель и как отказаться от использования данных.',
    link: { label: 'Политика', href: '#' },
  },
] satisfies Array<{
  id: string;
  icon: IconName;
  title: string;
  text: string;
  link: { label: string; href: string };
}>;
