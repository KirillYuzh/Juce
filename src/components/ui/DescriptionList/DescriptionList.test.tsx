import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DescriptionList } from './DescriptionList';

describe('DescriptionList', () => {
  it('renders a dl with term and definition for every item', () => {
    render(
      <DescriptionList
        items={[
          { label: 'Владелец', value: 'Команда ядра' },
          { id: 'date', label: 'Дата', value: '27 ноября' },
        ]}
      />
    );

    const list = screen.getByText('Владелец').closest('dl');
    expect(list).toBeTruthy();
    expect(list?.querySelectorAll('dt')).toHaveLength(2);
    expect(list?.querySelectorAll('dd')).toHaveLength(2);
    expect(screen.getByText('Владелец').tagName).toBe('DT');
    expect(screen.getByText('Команда ядра').tagName).toBe('DD');
  });

  it('sets the number of columns through a data attribute', () => {
    const { container } = render(
      <DescriptionList columns={3} items={[{ label: 'Проект', value: 'Вектор' }]} />
    );

    expect(container.querySelector('dl')?.getAttribute('data-columns')).toBe('3');
  });

  it('defaults to a single column', () => {
    const { container } = render(
      <DescriptionList items={[{ label: 'Проект', value: 'Вектор' }]} />
    );

    expect(container.querySelector('dl')?.getAttribute('data-columns')).toBe('1');
  });
});
