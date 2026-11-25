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
      { title: 'Поиск по документации', href: '#' },
      { title: 'Разбор кода', href: '#' },
      { title: 'Задачи и тесты', href: '#' },
      { title: 'Конспекты лекций', href: '#' },
      { title: 'Шпаргалки', href: '#' },
    ],
  },
  {
    title: 'Разработчикам',
    href: '#/researchers',
    children: [
      { title: 'Java-разработчикам', href: '#/researchers' },
      { title: 'Go-командам', href: '#/researchers' },
      { title: 'ML-инженерам', href: '#/researchers' },
      { title: 'Студентам', href: '#/researchers' },
      { title: 'Учебным группам', href: '#/researchers' },
    ],
  },
  {
    title: 'Материалы',
    href: '#',
    children: [
      { title: 'Статьи', href: '#' },
      { title: 'Задачи', href: '#' },
      { title: 'Конспекты', href: '#' },
      { title: 'Разборы собеседований', href: '#' },
    ],
  },
  {
    title: 'Ещё',
    href: '#',
    children: [
      { title: 'Документация', href: '#' },
      { title: 'API платформы', href: '#' },
      { title: 'Помощь', href: '#' },
      { title: 'О проекте', href: '#' },
    ],
  },
];

export interface Product {
  id: string;
  title: string;
  description?: string;
  image: string;
  cta: string;
  href: string;
}

export const products: Product[] = [
  {
    id: 'java',
    title: 'Java-разработчикам',
    description: 'Generics, байткод и JVM-настройки на понятных примерах',
    image: '/image.png',
    cta: 'Начать',
    href: '#/assistant',
  },
  {
    id: 'go',
    title: 'Go-командам',
    description: 'Разбор горутин, каналов и аллокаций без лишней теории',
    image: '/image.png',
    cta: 'Подробнее',
    href: '#/assistant',
  },
  {
    id: 'math',
    title: 'Студентам',
    description: 'Линейная алгебра и дискретка: доказательства шаг за шагом',
    image: '/image.png',
    cta: 'Подробнее',
    href: '#/assistant',
  },
  {
    id: 'ml',
    title: 'ML-инженерам',
    description: 'От градиентов до тюнинга: формулы и код рядом',
    image: '/image.png',
    cta: 'Подробнее',
    href: '#/assistant',
  },
];

export const services = [
  {
    id: 'search',
    title: 'Поиск по документации и коду',
    text: 'Находит нужный раздел javadoc, pkg.go.dev или исходников, отбрасывает устаревшее и объясняет, почему выбрал этот ответ.',
    link: { label: 'Попробовать', href: '#/assistant' },
  },
  {
    id: 'review',
    title: 'Разбор темы',
    text: 'Собирает объяснение по теме: определения, примеры и типичные ошибки, с ссылкой на каждый шаг.',
    link: { label: 'Как это работает', href: '#' },
  },
  {
    id: 'cite',
    title: 'Тесты и примеры',
    text: 'Пишет юнит-тесты на JUnit и Go, разбирает падения и показывает минимальный пример, который воспроизводит баг.',
    link: { label: 'Стандарты', href: '#' },
  },
] satisfies Array<{
  id: string;
  title: string;
  text: string;
  link: { label: string; href: string };
}>;

export const researchPromos = [
  {
    id: 'team',
    title: 'Командам и группам',
    text: 'Общая библиотека заметок, история запросов и один контекст для всей команды',
    image: '/image.png',
    cta: 'Подключить команду',
    href: '#/assistant',
  },
  {
    id: 'exam',
    title: 'Подготовка к сессии',
    text: 'Разбор задач по линейной алгебре и дискретке с полными выкладками, а не только ответом',
    image: '/image.png',
    cta: 'Узнать больше',
    href: '#/assistant',
  },
];
