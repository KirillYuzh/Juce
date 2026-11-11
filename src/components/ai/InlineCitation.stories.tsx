import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from './InlineCitation';

const meta: Meta = {
  title: 'AI/Inline citation',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const paragraph: CSSProperties = {
  margin: 0,
  maxWidth: 520,
  font: '400 15px/24px var(--tb-font-text)',
  color: 'var(--tb-text-primary)',
};

export const InText: Story = {
  render: () => (
    <p style={paragraph}>
      <InlineCitationText>
        Воспроизводимость проверяют повторным анализом открытых данных
      </InlineCitationText>
      <InlineCitation>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={[{ url: 'https://arxiv.org/' }]} />
          <InlineCitationCardBody>
            <InlineCitationSource url="https://arxiv.org/" title="arXiv: препринты" />
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      <InlineCitationText>, реже — независимой репликацией.</InlineCitationText>
    </p>
  ),
};

export const MultipleSources: Story = {
  render: () => (
    <p style={paragraph}>
      <InlineCitationText>Про методы и данные можно прочитать в разделах</InlineCitationText>
      <InlineCitation>
        <InlineCitationCard>
          <InlineCitationCardTrigger
            sources={[
              { url: 'https://arxiv.org/' },
              { url: 'https://www.nature.com/' },
              { url: 'https://scholar.google.com/' },
            ]}
          />
          <InlineCitationCardBody>
            <InlineCitationSource url="https://arxiv.org/" title="arXiv: препринты" />
            <InlineCitationSource url="https://www.nature.com/" title="Nature" />
            <InlineCitationSource url="https://scholar.google.com/" />
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      <InlineCitationText>.</InlineCitationText>
    </p>
  ),
};

export const Quote: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 460 }}>
      <InlineCitation>
        <InlineCitationQuote>
          «Кэшбэк рублями — единственная валюта начисления по дебетовой карте».
        </InlineCitationQuote>
      </InlineCitation>
      <p style={{ ...paragraph, color: 'var(--tb-text-secondary)' }}>
        <InlineCitationText>Источник: тарифы дебетовой карты.</InlineCitationText>
      </p>
    </div>
  ),
};
