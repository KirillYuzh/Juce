import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card, CardBody, CardFooter, CardTitle } from './Card';
import { DetailCard } from '../../prebuilt/DetailCard';
import { MediaPanel } from '../../prebuilt/MediaPanel';

describe('Card', () => {
  it('renders tone and density as data attributes', () => {
    const { container } = render(
      <Card tone="inverse" density="l">
        <CardBody>
          <CardTitle>Заголовок</CardTitle>
        </CardBody>
      </Card>
    );
    const card = container.querySelector('[data-slot="card"]');
    expect(card?.getAttribute('data-tone')).toBe('inverse');
    expect(card?.getAttribute('data-density')).toBe('l');
  });

  it('renders a link with interactive state when href is set', () => {
    render(
      <Card as="a" href="/go" interactive>
        <CardBody>
          <CardTitle>Диалог</CardTitle>
        </CardBody>
      </Card>
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/go');
    expect(link.hasAttribute('data-interactive')).toBe(true);
  });

  it('renders a link by default when href is set', () => {
    render(
      <Card href="/go" interactive>
        <CardBody>
          <CardTitle>Диалог</CardTitle>
        </CardBody>
      </Card>
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/go');
  });

  it('не превращает карточку в кнопку без href', () => {
    render(
      <Card>
        <CardBody>
          <CardTitle>Диалог</CardTitle>
        </CardBody>
      </Card>
    );
    const card = screen.getByRole('article');

    expect(card.hasAttribute('role')).toBe(false);
    expect(card.hasAttribute('tabindex')).toBe(false);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps the footer on the card surface', () => {
    const { container } = render(
      <Card tone="inverse">
        <CardFooter>Подвал</CardFooter>
      </Card>
    );
    const footer = container.querySelector('[data-slot="card-footer"]');
    expect(footer?.hasAttribute('data-tone')).toBe(false);
  });
});

describe('DetailCard', () => {
  it('renders title, description, tags, meta and link', () => {
    render(
      <DetailCard
        href="/go"
        title="Утечка горутины"
        description="Разбор"
        tags={<span>Go</span>}
        meta={[{ id: 'level', label: 'Уровень', value: 'Senior' }]}
      />
    );
    expect(screen.getByRole('heading')).toBeTruthy();
    expect(screen.getByText('Разбор')).toBeTruthy();
    expect(screen.getByText('Go')).toBeTruthy();
    expect(screen.getByText('Уровень')).toBeTruthy();
    expect(screen.getByText('Senior')).toBeTruthy();
    expect(screen.getByRole('link').getAttribute('href')).toBe('/go');
  });

  it('stays an article without href', () => {
    render(<DetailCard title="Без ссылки" />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('article')).toBeTruthy();
  });
});

describe('MediaPanel', () => {
  it('renders media as a side cell without a footer divider', () => {
    const { container } = render(
      <MediaPanel
        title="Платформа"
        text="Текст"
        media={<img alt="" src="/x.png" />}
        links={[{ label: 'Открыть', href: '/go' }]}
      />
    );
    const media = container.querySelector('[data-slot="card-media"]');
    expect(media?.getAttribute('data-position')).toBe('side');
    expect(container.querySelector('[data-slot="card-footer"]')).toBeNull();
    expect(screen.getByRole('link').getAttribute('href')).toBe('/go');
  });
});
