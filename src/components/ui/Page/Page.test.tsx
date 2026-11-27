import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Breadcrumbs, Page, PageContent, PageHeader } from './Page';
import styles from './Page.module.css';
import { Avatar } from '../Display';
import { Image } from '../Image';

describe('Page', () => {
  it('renders the header, content and a single h1', () => {
    render(
      <Page>
        <PageHeader title="Проект «Вектор»" description="Описание проекта" />
        <PageContent>Содержимое страницы</PageContent>
      </Page>
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Проект «Вектор»');
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByText('Описание проекта')).toBeTruthy();
    expect(screen.getByText('Содержимое страницы')).toBeTruthy();
  });

  it('renders actions passed to the header', () => {
    render(<PageHeader title="Проект" actions={<button type="button">Настройки</button>} />);

    expect(screen.getByRole('button', { name: 'Настройки' })).toBeTruthy();
  });

  it('renders leading next to the title and keeps a single h1', () => {
    render(
      <PageHeader
        title="Анна Ковалёва"
        description="Backend-инженер"
        leading={<Avatar size="l" initials="АК" />}
      />
    );

    expect(screen.getByRole('img', { name: 'АК' })).toBeTruthy();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Анна Ковалёва');
  });

  it('renders media as an image above the title', () => {
    const { container } = render(
      <PageHeader
        title="Проект «Вектор»"
        media={<Image src="/images/wang/roof.png" alt="Обложка" ratio="photo" />}
      />
    );

    const image = container.querySelector('[data-slot="image"] img');
    expect(image?.getAttribute('src')).toBe('/images/wang/roof.png');
    expect(container.querySelectorAll('[data-slot="image"]')).toHaveLength(1);
  });

  it('overlaps the leading element with the media banner', () => {
    const { container } = render(
      <PageHeader
        title="Проект «Вектор»"
        leading={<Avatar size="l" initials="В" />}
        media={<Image src="/images/wang/roof.png" alt="" ratio="photo" />}
      />
    );

    expect(container.querySelector(`.${styles.leadingOverMedia}`)).toBeTruthy();
  });
});

describe('Breadcrumbs', () => {
  it('is a navigation landmark with the current page as plain text', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Главная', href: '/' },
          { label: 'Проекты', href: '/projects' },
          { label: 'Вектор' },
        ]}
      />
    );

    const nav = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    const links = within(nav).getAllByRole('link');

    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/', '/projects']);
    expect(within(nav).getByText('Вектор').getAttribute('aria-current')).toBe('page');
    expect(within(nav).queryByRole('link', { name: 'Вектор' })).toBeNull();
  });

  it('takes the navigation name from label', () => {
    render(
      <Breadcrumbs label="Путь" items={[{ label: 'Главная', href: '/' }, { label: 'Вектор' }]} />
    );

    expect(screen.getByRole('navigation', { name: 'Путь' })).toBeTruthy();
  });

  it('renders links through linkComponent', () => {
    function Link({ href, children }: { href: string; children?: React.ReactNode }) {
      return (
        <a data-custom-link href={href}>
          {children}
        </a>
      );
    }

    render(
      <Breadcrumbs
        linkComponent={Link}
        items={[{ label: 'Главная', href: '/' }, { label: 'Вектор' }]}
      />
    );

    expect(screen.getByRole('link', { name: 'Главная' }).hasAttribute('data-custom-link')).toBe(
      true
    );
  });

  it('renders an earlier item without href or onClick as plain text', () => {
    render(<Breadcrumbs items={[{ label: 'Раздел' }, { label: 'Вектор' }]} />);

    const nav = screen.getByRole('navigation', { name: 'Хлебные крошки' });
    const plain = within(nav).getByText('Раздел');

    expect(plain.tagName).toBe('SPAN');
    expect(plain.hasAttribute('aria-current')).toBe(false);
    expect(within(nav).queryByRole('link')).toBeNull();
    expect(within(nav).queryByRole('button')).toBeNull();
    expect(nav.querySelector('a')).toBeNull();
    expect(nav.querySelector('[href="#"]')).toBeNull();
  });

  it('renders an earlier item with only onClick as a button', () => {
    const onClick = vi.fn();

    render(<Breadcrumbs items={[{ label: 'Проекты', onClick }, { label: 'Вектор' }]} />);

    const button = screen.getByRole('button', { name: 'Проекты' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.getAttribute('type')).toBe('button');
    expect(screen.queryByRole('link')).toBeNull();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('cancels navigation and calls onClick', () => {
    const onClick = vi.fn();

    render(
      <Breadcrumbs
        items={[{ label: 'Проекты', href: '/projects', onClick }, { label: 'Вектор' }]}
      />
    );

    const link = screen.getByRole('link', { name: 'Проекты' });
    const dispatched = fireEvent.click(link);

    expect(dispatched).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(link.getAttribute('href')).toBe('/projects');
  });
});
