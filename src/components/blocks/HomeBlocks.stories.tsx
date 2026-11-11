import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard, PromoCard, StatPanel, TextCard, WideBanner } from './HomeBlocks';
import { products, services } from '../../data/home';

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
        title="Обзор за вечер"
        text="Черновик обзора по вашей теме с ссылками на каждый тезис"
        image="/images/wang/roof.png"
        cta="Попробовать"
        href="#/assistant"
      />
      <PromoCard
        title="Граф связей между статьями"
        text="Показывает, кто на кого ссылается и где выводы расходятся"
        image="/images/wang/smile.png"
        cta="Посмотреть"
        href="#/assistant"
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
        title="Джупсик в браузере"
        text="Откройте ассистента без установки: поиск, обзоры и ссылки работают прямо в браузере"
        image="/images/wang/listen.png"
        links={[
          { label: 'Открыть чат', href: '#/assistant', icon: 'globe' },
          { label: 'Документация', href: '#', icon: 'code' },
        ]}
      />
    </div>
  ),
};

export const WideBannerStory: Story = {
  name: 'Wide banner',
  render: () => (
    <div className="tb-container" style={container}>
      <WideBanner
        title="Как собрать обзор литературы за вечер"
        source="Блог Джус"
        image="/images/wang/listen.png"
        cta="Читать"
        href="#"
      />
    </div>
  ),
};
