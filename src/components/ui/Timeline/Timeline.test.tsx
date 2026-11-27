import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Timeline, type TimelineItem } from './Timeline';
import { Icon } from '../Icon';

const items: TimelineItem[] = [
  { id: 'plan', title: 'План', time: '09:00', tone: 'success' },
  { id: 'build', title: 'Сборка', description: 'Типы и тесты', tone: 'accent' },
  { id: 'review', title: 'Ревью', time: '12:30' },
  { id: 'release', title: 'Релиз', description: 'Пакет опубликован', tone: 'error' },
];

describe('Timeline', () => {
  it('renders every item in order', () => {
    const { container } = render(<Timeline items={items} />);
    const titles = Array.from(container.querySelectorAll('[data-slot="timeline-title"]')).map(
      (node) => node.textContent
    );

    expect(titles).toEqual(['План', 'Сборка', 'Ревью', 'Релиз']);
  });

  it('renders the tone of each item as a data attribute', () => {
    const { container } = render(<Timeline items={items} />);
    const tones = Array.from(container.querySelectorAll('[data-slot="timeline-item"]')).map((node) =>
      node.getAttribute('data-tone')
    );

    expect(tones).toEqual(['success', 'accent', 'neutral', 'error']);
  });

  it('renders a custom icon in place of the default dot', () => {
    const { container } = render(
      <Timeline items={[{ title: 'С иконкой', icon: <Icon name="check" /> }]} />
    );
    const marker = container.querySelector('[data-slot="timeline-marker"]');

    expect(marker?.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('[data-slot="timeline-dot"]')).toBeNull();
  });

  it('uses list semantics and joins items with a line', () => {
    const { container } = render(<Timeline items={items} />);
    const list = screen.getByRole('list');

    expect(list.tagName).toBe('OL');
    expect(screen.getAllByRole('listitem')).toHaveLength(items.length);
    expect(container.querySelectorAll('[data-slot="timeline-line"]')).toHaveLength(
      items.length - 1
    );
  });
});
