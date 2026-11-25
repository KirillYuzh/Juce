import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible';

describe('Collapsible', () => {
  it('не держит aria-controls, пока панель не смонтирована', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger>Открыть</CollapsibleTrigger>
        <CollapsibleContent>Текст</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-controls')).toBe(false);

    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByText('Текст').id);
  });

  it('сохраняет aria-controls при keepMounted', () => {
    render(
      <Collapsible keepMounted>
        <CollapsibleTrigger>Открыть</CollapsibleTrigger>
        <CollapsibleContent>Текст</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    expect(trigger.getAttribute('aria-controls')).toBe(screen.getByText('Текст').id);
  });

  it('ставит aria-атрибуты после пропсов', () => {
    render(
      <Collapsible>
        <CollapsibleTrigger aria-expanded={false} aria-controls="external">
          Открыть
        </CollapsibleTrigger>
        <CollapsibleContent>Текст</CollapsibleContent>
      </Collapsible>
    );
    const trigger = screen.getByRole('button', { name: 'Открыть' });

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.hasAttribute('aria-controls')).toBe(false);
  });
});
