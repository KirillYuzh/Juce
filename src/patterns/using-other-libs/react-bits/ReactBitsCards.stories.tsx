import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../../../lib/cx';
import { useThemeTokens } from '../../../lib/use-theme-tokens';
import { TextLink } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Display';
import { DetailCard } from '../../../components/prebuilt';
import PixelCard from './Components/PixelCard/PixelCard';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import SwipeRow, { type SwipeAction } from './Micro/SwipeRow/SwipeRow';
import styles from './ReactBitsCards.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/react-bits/Cards',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Эффекты react-bits живут внутри наших компонентов: PixelCard стоит в media у DetailCard, ProfileCard и SwipeRow оформлены токенами и нашим контентом. Четыре панели лежат на --tb-bg, --tb-surface, --tb-bg-secondary и --tb-bg-tertiary, чтобы разница поверхностей была видна. Canvas не понимает var(), поэтому цвета разрешаются в hex хуком useThemeTokens.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const actions: SwipeAction[] = [
  { id: 'delete', label: 'Удалить' },
  { id: 'archive', label: 'В архив' },
];

const CardsScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.board}>
      <section className={cx(styles.panel, styles.bg)}>
        <span className={styles.caption}>--tb-bg · media right</span>
        <DetailCard
          title="Пиксельная карточка"
          description="PixelCard стоит в media справа, а заголовок, текст и ссылка — наши."
          mediaPosition="right"
          tags={<Badge tone="accent">PixelCard</Badge>}
          media={
            <div className={styles.pixelHost}>
              <PixelCard
                theme={dark ? 'dark' : 'light'}
                colors={[primary, accent]}
                glowColor={accent}
                radius={0}
                trigger="always"
              />
            </div>
          }
        >
          <TextLink href="#" arrow>
            Открыть
          </TextLink>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.surface)}>
        <span className={styles.caption}>--tb-surface · media back</span>
        <DetailCard
          title="Эффект на всю карточку"
          description="Тот же PixelCard в mediaPosition back: пиксели живут под нашим текстом."
          mediaPosition="back"
          tags={<Badge tone="neutral">Effect</Badge>}
          media={
            <div className={styles.pixelHost}>
              <PixelCard
                theme={dark ? 'dark' : 'light'}
                colors={[primary, accent]}
                glowColor={accent}
                radius={0}
                trigger="always"
              />
            </div>
          }
        >
          <TextLink href="#" arrow>
            Открыть
          </TextLink>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.secondary)}>
        <span className={styles.caption}>--tb-bg-secondary · ProfileCard поверх DetailCard</span>
        <DetailCard
          title="ProfileCard на нашей карточке"
          description="Профиль лежит поверх DetailCard: рамка, заголовок и текст наши, эффект — react-bits."
          tags={<Badge tone="neutral">ProfileCard</Badge>}
        >
          <div className={styles.profileSlot}>
            <ProfileCard
              avatarUrl="/images/wang/laugh.jpeg"
              name="Джупсик"
              title="Ассистент по коду"
              handle="jupsi"
              status="На связи"
              statusColor={accent}
              backdropColor={bg}
              contactText="Написать"
              theme={dark ? 'dark' : 'light'}
            />
          </div>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.tertiary)}>
        <span className={styles.caption}>--tb-bg-tertiary · SwipeRow</span>
        <div className={styles.slot}>
          <SwipeRow
            actions={actions}
            rowColor={bg}
            drawerColor={primary}
            actionColor={accent}
            textColor={text}
            label="Задача на ревью"
            height={88}
          >
            <div className={styles.swipeContent}>
              <Badge tone="accent">Review</Badge>
              <span className="tb-text-m">Проверить дифф</span>
              <TextLink href="#" arrow>
                Открыть
              </TextLink>
            </div>
          </SwipeRow>
        </div>
      </section>
    </div>
  );
};

const cardsSource = `import { useState } from 'react';
import { cx } from '../../../lib/cx';
import { useThemeTokens } from '../../../lib/use-theme-tokens';
import { TextLink } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Display';
import { DetailCard } from '../../../components/prebuilt';
import PixelCard from './Components/PixelCard/PixelCard';
import ProfileCard from './Components/ProfileCard/ProfileCard';
import SwipeRow from './Micro/SwipeRow/SwipeRow';
import styles from './ReactBitsCards.module.css';

const actions = [
  { id: 'delete', label: 'Удалить' },
  { id: 'archive', label: 'В архив' },
];

export function Cards() {
  const [host, setHost] = useState(null);
  const { bg, text, accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.board}>
      <section className={cx(styles.panel, styles.bg)}>
        <span className={styles.caption}>--tb-bg · media right</span>
        <DetailCard
          title="Пиксельная карточка"
          description="PixelCard стоит в media справа, а заголовок, текст и ссылка — наши."
          mediaPosition="right"
          tags={<Badge tone="accent">PixelCard</Badge>}
          media={
            <div className={styles.pixelHost}>
              <PixelCard
                theme={dark ? 'dark' : 'light'}
                colors={[primary, accent]}
                glowColor={accent}
                radius={0}
                trigger="always"
              />
            </div>
          }
        >
          <TextLink href="#" arrow>
            Открыть
          </TextLink>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.surface)}>
        <span className={styles.caption}>--tb-surface · media back</span>
        <DetailCard
          title="Эффект на всю карточку"
          description="Тот же PixelCard в mediaPosition back: пиксели живут под нашим текстом."
          mediaPosition="back"
          tags={<Badge tone="neutral">Effect</Badge>}
          media={
            <div className={styles.pixelHost}>
              <PixelCard
                theme={dark ? 'dark' : 'light'}
                colors={[primary, accent]}
                glowColor={accent}
                radius={0}
                trigger="always"
              />
            </div>
          }
        >
          <TextLink href="#" arrow>
            Открыть
          </TextLink>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.secondary)}>
        <span className={styles.caption}>--tb-bg-secondary · ProfileCard поверх DetailCard</span>
        <DetailCard
          title="ProfileCard на нашей карточке"
          description="Профиль лежит поверх DetailCard: рамка, заголовок и текст наши, эффект — react-bits."
          tags={<Badge tone="neutral">ProfileCard</Badge>}
        >
          <div className={styles.profileSlot}>
            <ProfileCard
              avatarUrl="/images/wang/laugh.jpeg"
              name="Джупсик"
              title="Ассистент по коду"
              handle="jupsi"
              status="На связи"
              statusColor={accent}
              backdropColor={bg}
              contactText="Написать"
              theme={dark ? 'dark' : 'light'}
            />
          </div>
        </DetailCard>
      </section>

      <section className={cx(styles.panel, styles.tertiary)}>
        <span className={styles.caption}>--tb-bg-tertiary · SwipeRow</span>
        <div className={styles.slot}>
          <SwipeRow
            actions={actions}
            rowColor={bg}
            drawerColor={primary}
            actionColor={accent}
            textColor={text}
            label="Задача на ревью"
            height={88}
          >
            <div className={styles.swipeContent}>
              <Badge tone="accent">Review</Badge>
              <span className="tb-text-m">Проверить дифф</span>
              <TextLink href="#" arrow>
                Открыть
              </TextLink>
            </div>
          </SwipeRow>
        </div>
      </section>
    </div>
  );
}`;

export const Cards: Story = {
  name: 'DetailCard, ProfileCard, SwipeRow',
  render: () => <CardsScene />,
  parameters: {
    docs: {
      source: {
        code: cardsSource,
        language: 'tsx',
      },
    },
  },
};
