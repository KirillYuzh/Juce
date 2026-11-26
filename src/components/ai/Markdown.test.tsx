import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('drops a javascript: link instead of putting it into href', () => {
    render(<Markdown>{'[опасно](javascript:alert(1))'}</Markdown>);
    const link = screen.getByText('опасно').closest('a');
    expect(link?.getAttribute('href')).toBeNull();
  });

  it('renders an external image lazily and without a referrer', () => {
    render(<Markdown>{'![схема](https://attacker.example/pixel.png)'}</Markdown>);
    const image = screen.getByAltText('схема') as HTMLImageElement;
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(image.getAttribute('decoding')).toBe('async');
    expect(image.getAttribute('referrerpolicy')).toBe('no-referrer');
  });

  it('skips an image whose source is not safe', () => {
    render(<Markdown>{'![пиксель](javascript:alert(1))'}</Markdown>);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('renders headings, lists and tables', () => {
    render(<Markdown>{'# Заголовок\n\n- один\n- два\n\n| a | b |\n| --- | --- |\n| 1 | 2 |'}</Markdown>);
    expect(screen.getByRole('heading', { name: 'Заголовок' })).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('table')).toBeTruthy();
  });
});
