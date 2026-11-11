import type { Meta, StoryObj } from '@storybook/react-vite';
import { Awards, DirectionCard, StartCards, ValuesGrid } from './CareerBlocks';
import { careerAwards, careerDirections, careerStart, careerValues } from '../../data/career';

const meta: Meta = {
  title: 'Blocks/Career blocks',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Directions: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {careerDirections.map((direction) => (
        <DirectionCard key={direction.id} direction={direction} />
      ))}
    </div>
  ),
};

export const Values: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <ValuesGrid values={careerValues} />
    </div>
  ),
};

export const AwardsBlock: Story = {
  name: 'Awards',
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <Awards
        awards={careerAwards}
        heroImage="/images/tbank/career/awards-hero.png"
        bannerImage="/images/tbank/career/award-forbes.png"
      />
    </div>
  ),
};

export const Start: Story = {
  render: () => (
    <div className="tb-container" style={{ paddingBlock: 32 }}>
      <StartCards cards={careerStart} />
    </div>
  ),
};
