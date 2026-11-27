import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Callout,
  Heading,
  InlineCode,
  ListItem,
  OrderedList,
  Quote,
  Text,
  UnorderedList,
} from './Typography';
import styles from './Typography.module.css';

describe('Heading', () => {
  it('renders the tag that matches the visual level', () => {
    render(<Heading level={3}>Подзаголовок</Heading>);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading.tagName).toBe('H3');
    expect(heading.classList.contains(styles.level3)).toBe(true);
  });

  it('overrides the tag with as', () => {
    render(
      <Heading level={1} as="h2">
        Визуально первый
      </Heading>
    );

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.tagName).toBe('H2');
    expect(heading.classList.contains(styles.level1)).toBe(true);
  });
});

describe('Text', () => {
  it('applies size, tone and weight classes', () => {
    render(
      <Text size="l" tone="secondary" weight="bold">
        Текст
      </Text>
    );

    const text = screen.getByText('Текст');
    expect(text.tagName).toBe('P');
    expect(text.classList.contains(styles.sizeL)).toBe(true);
    expect(text.classList.contains(styles.toneSecondary)).toBe(true);
    expect(text.classList.contains(styles.weightBold)).toBe(true);
  });

  it('changes the rendered tag', () => {
    render(
      <Text as="span" tone="error">
        Ошибка
      </Text>
    );

    expect(screen.getByText('Ошибка').tagName).toBe('SPAN');
  });

  it('renders an anchor with the link tone when href is set', () => {
    render(<Text href="/docs">Документация</Text>);

    const link = screen.getByRole('link', { name: 'Документация' });
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.classList.contains(styles.toneLink)).toBe(true);
    expect(link.classList.contains(styles.linkText)).toBe(true);
  });

  it('removes the static underline with variant hover', () => {
    render(
      <Text href="/docs" variant="hover">
        Документация
      </Text>
    );

    const link = screen.getByRole('link', { name: 'Документация' });
    expect(link.classList.contains(styles.linkTextHover)).toBe(true);
  });

  it('keeps the paragraph tag without href', () => {
    render(<Text>Обычный текст</Text>);

    const text = screen.getByText('Обычный текст');
    expect(text.tagName).toBe('P');
    expect(text.classList.contains(styles.tonePrimary)).toBe(true);
    expect(text.classList.contains(styles.linkText)).toBe(false);
  });
});

describe('Quote', () => {
  it('renders the citation in a footer', () => {
    render(<Quote cite="Команда Juce">Цитата</Quote>);

    expect(screen.getByText('Цитата').tagName).toBe('BLOCKQUOTE');
    expect(screen.getByText('Команда Juce').tagName).toBe('CITE');
  });
});

describe('Callout', () => {
  it('uses role alert for errors', () => {
    render(<Callout tone="error">Сборка упала</Callout>);

    expect(screen.getByRole('alert').textContent).toContain('Сборка упала');
  });

  it('uses role note for the remaining tones', () => {
    render(<Callout tone="note">Полезно знать</Callout>);

    expect(screen.getByRole('note').textContent).toContain('Полезно знать');
  });

  it('renders the action as an outline button next to the text', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Callout tone="error" title="Ошибка" action={{ label: 'Повторить', onClick }}>
        Сборка упала
      </Callout>
    );

    const button = screen.getByRole('button', { name: 'Повторить' });
    expect(button.className).toContain('outline');
    expect(container.querySelector(`.${styles.calloutRow}`)).toBeTruthy();

    button.click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('Lists', () => {
  it('renders ordered and unordered lists', () => {
    const { container } = render(
      <>
        <OrderedList start={3}>
          <ListItem>Третий</ListItem>
        </OrderedList>
        <UnorderedList>
          <ListItem>Пункт</ListItem>
        </UnorderedList>
      </>
    );

    expect(container.querySelector('ol')?.getAttribute('start')).toBe('3');
    expect(container.querySelector('ul')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

describe('InlineCode', () => {
  it('renders a code element', () => {
    render(<InlineCode>npm run check</InlineCode>);

    expect(screen.getByText('npm run check').tagName).toBe('CODE');
  });
});
