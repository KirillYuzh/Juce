import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChipSelect } from './Fields';

const options = [
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
];

describe('ChipSelect', () => {
  it('adds and removes options', () => {
    const onChange = vi.fn();
    render(<ChipSelect label="Направления" options={options} value={['go']} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: 'Java' }));
    expect(onChange).toHaveBeenCalledWith(['go', 'java']);

    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('marks the selected options as pressed and labels the group', () => {
    render(<ChipSelect label="Направления" options={options} value={['go']} onChange={() => {}} />);

    expect(screen.getByRole('button', { name: 'Go' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Java' }).getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('group').getAttribute('aria-labelledby')).not.toBeNull();
  });
});
