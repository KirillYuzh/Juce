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
      <InlineCitationText>Кэшбэк начисляется рублями в конце расчётного периода</InlineCitationText>
      <InlineCitation>
        <InlineCitationCard>
          <InlineCitationCardTrigger sources={[{ url: 'https://www.tbank.ru/debit/' }]} />
          <InlineCitationCardBody>
            <InlineCitationSource url="https://www.tbank.ru/debit/" title="Дебетовые карты" />
          </InlineCitationCardBody>
        </InlineCitationCard>
      </InlineCitation>
      <InlineCitationText>, а категории можно менять раз в месяц.</InlineCitationText>
    </p>
  ),
};

export const MultipleSources: Story = {
  render: () => (
    <p style={paragraph}>
      <InlineCitationText>Про стажировки и офисы можно прочитать в разделах</InlineCitationText>
      <InlineCitation>
        <InlineCitationCard>
          <InlineCitationCardTrigger
            sources={[
              { url: 'https://www.tbank.ru/career/' },
              { url: 'https://www.tbank.ru/about/' },
              { url: 'https://www.tbank.ru/invest/' },
            ]}
          />
          <InlineCitationCardBody>
            <InlineCitationSource url="https://www.tbank.ru/career/" title="Карьера в Т-Банке" />
            <InlineCitationSource url="https://www.tbank.ru/about/" title="О компании" />
            <InlineCitationSource url="https://www.tbank.ru/invest/" />
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
