import { createElement } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDomId } from './use-id';

function Probe({ label }: { label: string }) {
  const id = useDomId();
  return createElement('span', { 'data-probe': label }, id);
}

function probeIds(): string[] {
  return Array.from(document.querySelectorAll('[data-probe]')).map(
    (node) => node.textContent ?? ''
  );
}

describe('useDomId', () => {
  it('отдаёт непустой id без двоеточий', () => {
    render(createElement(Probe, { label: 'one' }));

    const [id] = probeIds();
    expect(id).not.toBe('');
    expect(id).not.toContain(':');
  });

  it('не меняется между ре-рендерами', () => {
    const view = render(createElement(Probe, { label: 'one' }));
    const [before] = probeIds();

    view.rerender(createElement(Probe, { label: 'one' }));

    expect(probeIds()[0]).toBe(before);
  });

  it('даёт разным компонентам разные id', () => {
    render(
      createElement(
        'div',
        null,
        createElement(Probe, { label: 'a' }),
        createElement(Probe, { label: 'b' })
      )
    );

    const [first, second] = probeIds();
    expect(first).not.toBe(second);
  });
});
