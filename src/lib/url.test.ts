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
    'https://x.y/z',
    'mailto:a@b.c',
  ])('allows absolute %s', (input) => {
    expect(safeHref(input)).toBe(input);
  });

  it.each(['#id', '?q=1', './a', '../a', '/a', '/relative/path', 'example.com/x'])(
    'keeps relative %s as is',
    (input) => {
      expect(safeHref(input)).toBe(input);
    }
  );

  it('normalises a scheme written in another case', () => {
    expect(safeHref('HTTPS://Example.com/A')).toBe('https://example.com/A');
  });

  it.each([
    'javascript:alert(1)',
    'JavaScript:alert(1)',
    ' javascript:alert(1)',
    'java\tscript:alert(1)',
    '\u0000javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    '//evil.example',
    '//host/path',
    'localhost:3000',
    '',
    '   ',
  ])('rejects %s', (input) => {
    expect(safeHref(input)).toBeUndefined();
  });
});
