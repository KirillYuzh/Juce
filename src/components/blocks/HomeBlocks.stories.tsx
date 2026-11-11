import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard, PromoCard, QuickLinks, StatPanel, TextCard, WideBanner } from './HomeBlocks';
import { quickLinks, products, services } from '../../data/home';

const meta: Meta = {
  title: 'Blocks/Home blocks',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const container = { padding: '32px 0' };
const grid = (columns: number) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  gap: 24,
});

export const QuickLinksRow: Story = {
  render: () => (
    <div className="tb-container" style={container}>
      <QuickLinks items={quickLinks} />
    </div>
  ),
};

export const ProductCardsLarge: Story = {
  render: () => (
    <div className="tb-container" style={{ ...container, ...grid(2) }}>
      {products.slice(0, 2).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ),
};

export const ProductCardsSmall: Story = {
  render: () => (
    <div className="tb-container" style={{ ...container, ...grid(3) }}>
      {products.slice(2).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ),
};

export const PromoCards: Story = {
  render: () => (
    <div className="tb-container" style={{ ...container, ...grid(2) }}>
      <PromoCard
        title="Приведи друга"
        text="До 10 000 ₽ за рекомендации друзьям"
        image="/images/tbank/services/friend.png"
        cta="Подробнее"
        href="https://www.tbank.ru/bring-friend/"
      />
      <PromoCard
        title="T‑Pay — оплата в одно касание"
        text="Всё как вы привыкли: легко, надежно и с сохранением кэшбэка"
        image="/images/tbank/services/tpay.png"
        cta="Попробовать"
        href="https://www.tbank.ru/tpay/"
        tone="dark"
      />
    </div>
  ),
};

export const TextCards: Story = {
  render: () => (
    <div className="tb-container" style={{ ...container, ...grid(3) }}>
      {services.map((service) => (
        <TextCard
          key={service.id}
          icon={service.icon}
          title={service.title}
          text={service.text}
          linkLabel={service.link.label}
          href={service.link.href}
        />
      ))}
    </div>
  ),
};

export const StatPanelStory: Story = {
  name: 'Stat panel',
  render: () => (
    <div className="tb-container" style={container}>
      <StatPanel
        title="Мобильное приложение Т-Банка"
        text="Проверяйте баланс, оплачивайте услуги, получайте помощь в чате 24/7"
        image="/images/tbank/app/phone.png"
      />
    </div>
  ),
};

export const WideBannerStory: Story = {
  name: 'Wide banner',
  render: () => (
    <div className="tb-container" style={container}>
      <WideBanner
        title="Как на самом деле пользоваться кредиткой"
        source="Т—Ж"
        image="/images/tbank/articles/credit.png"
        cta="Читать"
        href="https://journal.tinkoff.ru/"
      />
    </div>
  ),
};
