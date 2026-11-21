import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useCopy } from './clipboard';

function CopyButton({ value }: { value: string }) {
  const { copied, copy } = useCopy(value);
  return <button onClick={copy}>{copied ? 'Скопировано' : 'Скопировать'}</button>;
}

const writeText = vi.fn();
let execCommand: ReturnType<typeof vi.fn>;

beforeEach(() => {
  writeText.mockReset();
  execCommand = vi.fn(() => false);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
  Object.defineProperty(document, 'execCommand', {
    value: execCommand,
    configurable: true,
  });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  cleanup();
});

async function click() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });
}

describe('useCopy', () => {
  it('marks the button as copied and resets after the delay', async () => {
    writeText.mockResolvedValue(undefined);
    render(<CopyButton value="hello" />);

    await click();
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(screen.getByRole('button').textContent).toBe('Скопировано');

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('button').textContent).toBe('Скопировать');
  });

  it('falls back to execCommand when the clipboard API rejects', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    execCommand.mockReturnValue(true);
    render(<CopyButton value="hello" />);

    await click();
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('button').textContent).toBe('Скопировано');
  });

  it('stays unchanged when both paths fail', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    render(<CopyButton value="hello" />);

    await click();
    expect(screen.getByRole('button').textContent).toBe('Скопировать');
  });
});
