import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductShowcase } from './ProductShowcase';
import { cardDesigns } from '../../data/home';

const meta: Meta = {
  title: 'Blocks/Product showcase',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const DebitCard: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <ProductShowcase
        title="Дебетовая карта Black"
        designs={cardDesigns}
        cashbackOptions={[
          { value: 'all', label: 'Выберите повышенный кэшбэк (четыре категории)' },
          { value: 'travel', label: 'Путешествия' },
          { value: 'food', label: 'Кафе и рестораны' },
          { value: 'transport', label: 'Транспорт' },
        ]}
      />
    </div>
  ),
};

export const Deposit: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <ProductShowcase
        title="Вклад с пополнением"
        designs={[]}
        cashbackOptions={[
          { value: '6', label: 'Срок вклада — 6 месяцев' },
          { value: '12', label: 'Срок вклада — 12 месяцев' },
          { value: '24', label: 'Срок вклада — 24 месяца' },
        ]}
      />
    </div>
  ),
};
