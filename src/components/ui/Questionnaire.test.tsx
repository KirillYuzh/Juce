import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireAnswers,
  type QuestionnaireItemConfig,
} from './Questionnaire';

function SingleForm({
  multiple,
  onSubmit,
}: {
  multiple: boolean;
  onSubmit: (answers: QuestionnaireAnswers) => void;
}) {
  const items: QuestionnaireItemConfig[] = [
    {
      name: 'stack',
      prompt: 'Стек',
      multiple,
      choices: [
        { value: 'react', label: 'React' },
        { value: 'vue', label: 'Vue' },
      ],
    },
  ];

  return (
    <Questionnaire items={items} onSubmit={onSubmit}>
      <QuestionnaireItem name="stack">
        <QuestionnaireTitle>Стек</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="react">React</QuestionnaireChoice>
          <QuestionnaireChoice value="vue">Vue</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireInput label="Свой вариант" />
        <QuestionnaireActions>
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </QuestionnaireItem>
    </Questionnaire>
  );
}

describe('Questionnaire', () => {
  it('keeps selected choices when a custom answer is typed for a multiple item', () => {
    const onSubmit = vi.fn();
    render(<SingleForm multiple onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('checkbox', { name: 'React' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Vue' }));
    fireEvent.change(screen.getByLabelText('Свой вариант'), { target: { value: 'Svelte' } });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSubmit).toHaveBeenCalledWith({ stack: ['react', 'vue', 'Svelte'] });
  });

  it('replaces a single choice with the custom answer', () => {
    const onSubmit = vi.fn();
    render(<SingleForm multiple={false} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('radio', { name: 'React' }));
    fireEvent.change(screen.getByLabelText('Свой вариант'), { target: { value: 'Svelte' } });
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSubmit).toHaveBeenCalledWith({ stack: 'Svelte' });
  });
});
