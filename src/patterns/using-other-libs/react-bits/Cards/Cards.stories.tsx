import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../../../../lib/cx';
import { useThemeTokens } from '../../../../lib/use-theme-tokens';
import { Button, TextLink } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Display';
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from '../../../../components/ui/Card';
import { DetailCard, MediaPanel } from '../../../../components/prebuilt';
import HoloMosaic from '../HoloMosaic';
import GhostFibers from '../backgrounds/GhostFibers/GhostFibers';
import NeonGlyphs from '../backgrounds/NeonGlyphs/NeonGlyphs';
import Topography from '../backgrounds/Topography/Topography';
import PixelCard from '../Components/PixelCard/PixelCard';
import ProfileCard from '../Components/ProfileCard/ProfileCard';
import SwipeRow, { type SwipeAction } from '../Micro/SwipeRow/SwipeRow';
import styles from './Cards.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/react-bits/Cards',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Каждый приём — отдельная сторис. Эффекты react-bits живут внутри наших компонентов: PixelCard стоит в media у DetailCard, ProfileCard и SwipeRow оформлены токенами и нашим контентом, а фоны подставляются на место фото. Панели показывают --tb-bg, --tb-surface, --tb-bg-secondary и --tb-bg-tertiary. Canvas не понимает var(), поэтому цвета разрешаются в hex хуком useThemeTokens. Отдельные фоны — во вложенной группе Backgrounds.',
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

const CARD_IMPORTS = `import { useState } from 'react';
import { cx } from '../../../../lib/cx';
import { useThemeTokens } from '../../../../lib/use-theme-tokens';
import { Button, TextLink } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Display';
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from '../../../../components/ui/Card';
import { DetailCard, MediaPanel } from '../../../../components/prebuilt';
import HoloMosaic from '../HoloMosaic';
import GhostFibers from '../backgrounds/GhostFibers/GhostFibers';
import NeonGlyphs from '../backgrounds/NeonGlyphs/NeonGlyphs';
import Topography from '../backgrounds/Topography/Topography';
import PixelCard from '../Components/PixelCard/PixelCard';
import ProfileCard from '../Components/ProfileCard/ProfileCard';
import SwipeRow from '../Micro/SwipeRow/SwipeRow';
import styles from './Cards.module.css';`;

const frameSource = (card: string) => `${CARD_IMPORTS}

export function Demo() {
  const [host, setHost] = useState(null);
  const { bg, text, accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      ${card}
    </div>
  );
}`;

const surfaceSource = (panel: string, caption: string, card: string) => `${CARD_IMPORTS}

export function Demo() {
  const [host, setHost] = useState(null);
  const { bg, text, accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <section className={cx(styles.panel, styles.${panel})}>
        <span className={styles.caption}>${caption}</span>
        ${card}
      </section>
    </div>
  );
}`;

const PIXEL_RIGHT_CARD = `<DetailCard
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
</DetailCard>`;

const PIXEL_BACK_CARD = `<DetailCard
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
</DetailCard>`;

const PROFILE_CARD = `<DetailCard
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
</DetailCard>`;

const SWIPE_ROW_CARD = `<SwipeRow
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
</SwipeRow>`;

const CARD_TOP = `<Card>
  <CardMedia>
    <div className={styles.stage}>
      <Topography color={accent} lightMode={!dark} opacity={0.8} />
    </div>
  </CardMedia>
  <CardBody>
    <CardHeader>
      <CardTitle>Карта задачи</CardTitle>
      <Badge tone="accent">Новое</Badge>
    </CardHeader>
    <CardDescription>
      На месте фото стоит фон react-bits: карточка наша, картинку даёт библиотека.
    </CardDescription>
  </CardBody>
  <CardFooter>
    <Button size="s" variant="secondary" href="#">
      Открыть
    </Button>
  </CardFooter>
</Card>`;

const CARD_SIDE = `<Card mediaWidth="minmax(200px, 40%)">
  <CardBody>
    <CardHeader>
      <CardTitle>Разбор за вечер</CardTitle>
      <Badge tone="neutral">Видео</Badge>
    </CardHeader>
    <CardDescription>Медиа сбоку — это position="side" у CardMedia.</CardDescription>
  </CardBody>
  <CardFooter>
    <Button size="s" variant="secondary" href="#">
      Открыть
    </Button>
  </CardFooter>
  <CardMedia position="side">
    <div className={styles.stageSide}>
      <GhostFibers
        glowColor={accent}
        lineColor={text}
        secondaryColor={accent}
        lightMode={!dark}
        brightness={0.75}
        glow={0.7}
        vignette={0.2}
      />
    </div>
  </CardMedia>
</Card>`;

const MEDIA_PANEL = `<MediaPanel
  mediaWidth="minmax(200px, 40%)"
  title="Панель со сводкой"
  text="Медиа сбоку: HoloMosaic берёт цвет темы."
  links={[{ label: 'Открыть', href: '#' }]}
  media={
    <div className={styles.stageSide}>
      <HoloMosaic color={bg} metalColor={text} lightMode={!dark} />
    </div>
  }
/>`;

const DETAIL_CARD = `<DetailCard
  title="Профиль кандидата"
  description="Медиа сверху, теги и метаданные — те же примитивы Card."
  tags={<Badge tone="neutral">Frontend</Badge>}
  meta={[
    { label: 'Опыт', value: '6 лет' },
    { label: 'Стек', value: 'React, TypeScript' },
  ]}
  media={
    <div className={styles.stage}>
      <NeonGlyphs
        colors={[accent, text]}
        lightMode={!dark}
        cellSize={22}
        perspective={40}
        depth={20}
        fade={0.2}
      />
    </div>
  }
/>`;

const PixelCardRightScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <section className={cx(styles.panel, styles.bg)}>
        <span className={styles.caption}>--tb-bg</span>
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
    </div>
  );
};

export const PixelCardRight: Story = {
  name: 'PixelCard · media right',
  parameters: { docs: { source: { code: surfaceSource('bg', '--tb-bg', PIXEL_RIGHT_CARD) } } },
  render: () => <PixelCardRightScene />,
};

const PixelCardBackScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, primary, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <section className={cx(styles.panel, styles.surface)}>
        <span className={styles.caption}>--tb-surface</span>
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
    </div>
  );
};

export const PixelCardBack: Story = {
  name: 'PixelCard · media back',
  parameters: {
    docs: { source: { code: surfaceSource('surface', '--tb-surface', PIXEL_BACK_CARD) } },
  },
  render: () => <PixelCardBackScene />,
};

const ProfileCardScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, accent, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <section className={cx(styles.panel, styles.secondary)}>
        <span className={styles.caption}>--tb-bg-secondary</span>
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
    </div>
  );
};

export const ProfileCardOverCard: Story = {
  name: 'ProfileCard over our card',
  parameters: {
    docs: { source: { code: surfaceSource('secondary', '--tb-bg-secondary', PROFILE_CARD) } },
  },
  render: () => <ProfileCardScene />,
};

const SwipeRowScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, accent, primary } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <section className={cx(styles.panel, styles.tertiary)}>
        <span className={styles.caption}>--tb-bg-tertiary</span>
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
      </section>
    </div>
  );
};

export const SwipeRowWithContent: Story = {
  name: 'SwipeRow with our content',
  parameters: {
    docs: { source: { code: surfaceSource('tertiary', '--tb-bg-tertiary', SWIPE_ROW_CARD) } },
  },
  render: () => <SwipeRowScene />,
};

const CardBackgroundTopScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <Card>
        <CardMedia>
          <div className={styles.stage}>
            <Topography color={accent} lightMode={!dark} opacity={0.8} />
          </div>
        </CardMedia>
        <CardBody>
          <CardHeader>
            <CardTitle>Карта задачи</CardTitle>
            <Badge tone="accent">Новое</Badge>
          </CardHeader>
          <CardDescription>
            На месте фото стоит фон react-bits: карточка наша, картинку даёт библиотека.
          </CardDescription>
        </CardBody>
        <CardFooter>
          <Button size="s" variant="secondary" href="#">
            Открыть
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const CardBackgroundTop: Story = {
  name: 'Card · background on top',
  parameters: { docs: { source: { code: frameSource(CARD_TOP) } } },
  render: () => <CardBackgroundTopScene />,
};

const CardBackgroundSideScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <Card mediaWidth="minmax(200px, 40%)">
        <CardBody>
          <CardHeader>
            <CardTitle>Разбор за вечер</CardTitle>
            <Badge tone="neutral">Видео</Badge>
          </CardHeader>
          <CardDescription>Медиа сбоку — это position="side" у CardMedia.</CardDescription>
        </CardBody>
        <CardFooter>
          <Button size="s" variant="secondary" href="#">
            Открыть
          </Button>
        </CardFooter>
        <CardMedia position="side">
          <div className={styles.stageSide}>
            <GhostFibers
              glowColor={accent}
              lineColor={text}
              secondaryColor={accent}
              lightMode={!dark}
              brightness={0.75}
              glow={0.7}
              vignette={0.2}
            />
          </div>
        </CardMedia>
      </Card>
    </div>
  );
};

export const CardBackgroundSide: Story = {
  name: 'Card · background on the side',
  parameters: { docs: { source: { code: frameSource(CARD_SIDE) } } },
  render: () => <CardBackgroundSideScene />,
};

const MediaPanelScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <MediaPanel
        mediaWidth="minmax(200px, 40%)"
        title="Панель со сводкой"
        text="Медиа сбоку: HoloMosaic берёт цвет темы."
        links={[{ label: 'Открыть', href: '#' }]}
        media={
          <div className={styles.stageSide}>
            <HoloMosaic color={bg} metalColor={text} lightMode={!dark} />
          </div>
        }
      />
    </div>
  );
};

export const MediaPanelBackground: Story = {
  name: 'MediaPanel · background instead of a photo',
  parameters: { docs: { source: { code: frameSource(MEDIA_PANEL) } } },
  render: () => <MediaPanelScene />,
};

const DetailCardScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <DetailCard
        title="Профиль кандидата"
        description="Медиа сверху, теги и метаданные — те же примитивы Card."
        tags={<Badge tone="neutral">Frontend</Badge>}
        meta={[
          { label: 'Опыт', value: '6 лет' },
          { label: 'Стек', value: 'React, TypeScript' },
        ]}
        media={
          <div className={styles.stage}>
            <NeonGlyphs
              colors={[accent, text]}
              lightMode={!dark}
              cellSize={22}
              perspective={40}
              depth={20}
              fade={0.2}
            />
          </div>
        }
      />
    </div>
  );
};

export const DetailCardBackground: Story = {
  name: 'DetailCard · background instead of a photo',
  parameters: { docs: { source: { code: frameSource(DETAIL_CARD) } } },
  render: () => <DetailCardScene />,
};
