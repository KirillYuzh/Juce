import type { Meta, StoryObj } from '@storybook/react-vite';
import { Suggestion, Suggestions } from './Suggestion';

const meta: Meta = {
  title: 'AI/Suggestions',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const items = [
  'Почему утекает горутина?',
  'Что такое ранг матрицы?',
  'Как попасть на стажировку?',
];

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Suggestions>
        {items.map((item) => (
          <Suggestion key={item}>{item}</Suggestion>
        ))}
      </Suggestions>
    </div>
  ),
};

export const Overflow: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Suggestions>
        {[...items, 'Чем record отличается от класса?', 'Как оценить сложность алгоритма?'].map((item) => (
          <Suggestion key={item}>{item}</Suggestion>
        ))}
      </Suggestions>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Suggestions>
        <Suggestion disabled>Почему утекает горутина?</Suggestion>
        <Suggestion disabled>Что такое ранг матрицы?</Suggestion>
      </Suggestions>
    </div>
  ),
};
