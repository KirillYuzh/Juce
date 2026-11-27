import { describe, expect, it } from 'vitest';
import { hostOf, safeHref } from './url';

describe('hostOf', () => {
  it('strips the protocol and the www prefix', () => {
    expect(hostOf('https://www.go.dev/doc')).toBe('go.dev');
    expect(hostOf('http://pkg.go.dev')).toBe('pkg.go.dev');
  });

  it('returns the input when it is not a URL', () => {
    expect(hostOf('/docs/intro')).toBe('/docs/intro');
    expect(hostOf('не ссылка')).toBe('не ссылка');
    expect(hostOf('mailto:support@juce.edu')).toBe('mailto:support@juce.edu');
  });
});

describe('safeHref', () => {
  it.each([
    'https://go.dev/doc',
    'http://example.com/a',
    'mailto:support@juce.edu',
    '#anchor',
    '/docs',
    './a.png',
    '../up/a.png',
    '?page=2',
    '//evil.example/logo.png',
  ])('allows %s', (input) => {
    expect(safeHref(input)).toBe(input);
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    '',
    '   ',
  ])('rejects %s', (input) => {
    expect(safeHref(input)).toBeUndefined();
  });
});
