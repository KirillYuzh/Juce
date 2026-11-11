import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Recognition,
  DirectionCard,
  StartCards,
  VacancyCards,
  ValuesGrid,
} from './ResearcherBlocks';
import {
  researcherAwards,
  researcherDirections,
  researcherLearning,
  researcherVacancies,
  researcherValues,
} from '../../data/researchers';

const meta: Meta = {
  title: 'Blocks/Researchers',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Directions: Story = {
  render: () => (
    <div
      className="tb-container"
      style={{
        paddingBlock: 32,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: 24,
      }}
    >
      {researcherDirections.map((direction) => (
        <DirectionCard key={direction.id} direction={direction} />
      ))}
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <ValuesGrid values={researcherValues} />
    </div>
  ),
};

export const RecognitionBlock: Story = {
  name: 'Recognition',
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <Recognition
        items={researcherAwards}
        heroImage="/images/juce/researchers-2.png"
        bannerImage="/images/juce/researchers-3.png"
        bannerTitle="Открытая наука"
      />
    </div>
  ),
};

export const Learning: Story = {
  name: 'Learning',
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <StartCards cards={researcherLearning} />
    </div>
  ),
};

export const Vacancies: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <VacancyCards vacancies={researcherVacancies} />
    </div>
  ),
};
