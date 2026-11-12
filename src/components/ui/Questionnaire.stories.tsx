import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireAnswers,
  type QuestionnaireItemConfig,
} from './Questionnaire';

const meta: Meta = {
  title: 'Primitives/Questionnaire',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 520 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj;

const items: QuestionnaireItemConfig[] = [
  {
    name: 'topic',
    required: true,
    prompt: 'Что разбираем сегодня?',
    description: 'Выберите направление или напишите своё.',
    choices: [
      { value: 'java', label: 'Java', description: 'Generics, байткод, JVM' },
      { value: 'go', label: 'Go', description: 'Горутины, каналы, планировщик' },
      { value: 'math', label: 'Математика', description: 'Линейная алгебра и дискретка' },
    ],
    input: { label: 'Свой вариант', placeholder: 'Например, указатели в C' },
  },
  {
    name: 'extras',
    required: false,
    multiple: true,
    prompt: 'Что добавить к разбору?',
    description: 'Можно выбрать несколько вариантов или пропустить вопрос.',
    choices: [
      { value: 'tests', label: 'Тесты' },
      { value: 'bench', label: 'Бенчмарки' },
      { value: 'links', label: 'Ссылки на документацию' },
    ],
  },
  {
    name: 'depth',
    required: true,
    prompt: 'Насколько подробно?',
    choices: [
      { value: 'short', label: 'Коротко', description: 'Только суть и пример' },
      { value: 'deep', label: 'Подробно', description: 'С доказательством и кодом' },
    ],
  },
];

export const Default: Story = {
  render: () => <QuestionnaireStory />,
};

function QuestionnaireStory() {
  const [answers, setAnswers] = useState<QuestionnaireAnswers | null>(null);
  const [round, setRound] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Questionnaire
        key={round}
        items={items}
        onSubmit={(value) => setAnswers(value)}
      >
        <QuestionnaireProgress />
        {items.map((question) => (
          <QuestionnaireItem key={question.name} name={question.name}>
            <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
            <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
            <QuestionnaireChoices>
              {question.choices?.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  <span>{choice.label}</span>
                  {choice.description && <span>{choice.description}</span>}
                </QuestionnaireChoice>
              ))}
              {question.input && (
                <QuestionnaireInput
                  label={question.input.label}
                  placeholder={question.input.placeholder}
                />
              )}
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
        ))}
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>

      {answers && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <pre
            style={{
              margin: 0,
              padding: 16,
              borderRadius: 16,
              background: 'var(--tb-bg-secondary)',
              font: '400 13px/20px var(--tb-font-mono)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {JSON.stringify(answers, null, 2)}
          </pre>
          <button type="button" onClick={() => setRound(round + 1)}>
            Пройти заново
          </button>
        </div>
      )}
    </div>
  );
}
