import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireItemConfig,
} from './Questionnaire';

const items: QuestionnaireItemConfig[] = [
  {
    name: 'topic',
    prompt: 'Тема',
    choices: [
      { value: 'java', label: 'Java' },
      { value: 'go', label: 'Go' },
    ],
  },
  {
    name: 'depth',
    prompt: 'Глубина',
    choices: [
      { value: 'short', label: 'Коротко' },
      { value: 'deep', label: 'Подробно' },
    ],
  },
];

function renderQuestionnaire(onSubmit = vi.fn()) {
  render(
    <Questionnaire items={items} onSubmit={onSubmit}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="topic">
        <QuestionnaireTitle>Тема</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="java">Java</QuestionnaireChoice>
          <QuestionnaireChoice value="go">Go</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="depth">
        <QuestionnaireTitle>Глубина</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="short">Коротко</QuestionnaireChoice>
          <QuestionnaireChoice value="deep">Подробно</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  );
  return onSubmit;
}

describe('Questionnaire', () => {
  it('берёт name из своего вопроса, а не из активного', () => {
    const { container } = render(
      <Questionnaire items={items} onSubmit={vi.fn()}>
        <QuestionnaireItem name="topic">
          <QuestionnaireChoice value="java">Java</QuestionnaireChoice>
          <QuestionnaireChoice value="go">Go</QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireItem name="depth">
          <QuestionnaireChoice value="short">Коротко</QuestionnaireChoice>
          <QuestionnaireChoice value="deep">Подробно</QuestionnaireChoice>
        </QuestionnaireItem>
      </Questionnaire>
    );

    const radios = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    const names = (question: string) =>
      radios.filter((input) => input.name === question).map((input) => input.value);

    expect(names('topic')).toEqual(['java', 'go']);
    expect(names('depth')).toEqual(['short', 'deep']);
  });

  it('пишет ответ во втором вопросе в его собственный ключ', () => {
    const onSubmit = renderQuestionnaire();

    fireEvent.click(screen.getByRole('button', { name: 'Далее' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Подробно' }));
    fireEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({ depth: 'deep' });
  });

  it('держит прогресс в диапазоне 0..total с текущим шагом', () => {
    renderQuestionnaire();
    const progress = screen.getByRole('progressbar');

    expect(progress.getAttribute('aria-valuemin')).toBe('0');
    expect(progress.getAttribute('aria-valuemax')).toBe('2');
    expect(progress.getAttribute('aria-valuenow')).toBe('1');
  });
});
