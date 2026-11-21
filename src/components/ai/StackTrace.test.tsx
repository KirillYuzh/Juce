import { describe, expect, it } from 'vitest';
import { parseStackTrace } from './StackTrace';

const stack = [
  'Error: boom',
  '    at run (/app/src/run.ts:10:5)',
  '    at helper (/app/node_modules/lib/index.js:1:2)',
  '    at top',
].join('\n');

describe('parseStackTrace', () => {
  it('reads the error line and every frame', () => {
    const { error, frames } = parseStackTrace(stack);
    expect(error).toBe('Error: boom');
    expect(frames).toHaveLength(3);
  });

  it('extracts path, line and column', () => {
    const [first, second] = parseStackTrace(stack).frames;
    expect(first).toMatchObject({ path: '/app/src/run.ts', line: 10, column: 5, internal: false });
    expect(second.internal).toBe(true);
  });

  it('keeps a frame without a location as raw text', () => {
    const last = parseStackTrace(stack).frames[2];
    expect(last.raw).toBe('at top');
    expect(last.path).toBeUndefined();
    expect(last.line).toBeUndefined();
  });

  it('falls back to a readable error for an empty stack', () => {
    expect(parseStackTrace('').error).toBe('Неизвестная ошибка');
  });
});
