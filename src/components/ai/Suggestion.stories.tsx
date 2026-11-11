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
  'Как оформить карту?',
  'Какие условия по вкладам?',
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
        {[...items, 'Что с кэшбэком в этом месяце?', 'Как перевыпустить карту?'].map((item) => (
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
        <Suggestion disabled>Как оформить карту?</Suggestion>
        <Suggestion disabled>Какие условия по вкладам?</Suggestion>
      </Suggestions>
    </div>
  ),
};
