import { useState } from 'react';
import type { ReactNode, RefCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Display';
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
} from '../../../components/ui/Card';
import { DetailCard, MediaPanel } from '../../../components/prebuilt';
import { cx } from '../../../lib/cx';
import { useThemeTokens } from '../../../lib/use-theme-tokens';
import HoloMosaic from './HoloMosaic';
import AeroShards from './backgrounds/AeroShards/AeroShards';
import GradientASCII from './backgrounds/GradientASCII/GradientASCII';
import GhostFibers from './backgrounds/GhostFibers/GhostFibers';
import NeonGlyphs from './backgrounds/NeonGlyphs/NeonGlyphs';
import SideRays from './backgrounds/SideRays/SideRays';
import Topography from './backgrounds/Topography/Topography';
import styles from './ReactBits.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/react-bits',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Вендорные фоны react-bits лежат рядом исходниками и вызываются напрямую, без обёрток. Canvas/WebGL не понимает var(), поэтому роли --tb-bg, --tb-text-primary и --tb-accent разрешаются в hex хуком useThemeTokens и передаются в цветовые пропсы компонентов; при смене data-theme фон пересчитывается. Поверх фона и под контентом лежит скрим из --tb-bg, чтобы текст оставался читаемым; его снимают только там, где фон не пересекается с текстом (пример SideRays). Фон подставляется и в карточки на месте медиа. AeroShards рисует через WebGPU (vgpu): там, где WebGPU нет, onError убирает фон, и сцену держит подложка --tb-bg.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const scene = (host: RefCallback<HTMLElement>, background: ReactNode, scrim = true) => (
  <section ref={host} className={styles.scene}>
    <div className={styles.layer}>{background}</div>
    {scrim && <div className={styles.scrim} aria-hidden="true" />}
    <div className={styles.content}>
      <h2 className={cx('tb-h3', styles.heading)}>Разбираем задачу по шагам</h2>
      <p className={cx('tb-text-m', styles.lead)}>
        Задайте вопрос по своему коду — Джупсик найдёт место, где ломается логика, и объяснит
        правку.
      </p>
      <div className={styles.actions}>
        <Button iconRight="arrowRight">Начать разбор</Button>
        <Button variant="secondary">Посмотреть пример</Button>
      </div>
    </div>
  </section>
);

const sceneSource = (background: string, scrim = true) => {
  const scrimLine = scrim ? '      <div className={styles.scrim} aria-hidden="true" />\n' : '';

  return `const Scene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, accent, dark } = useThemeTokens(host);

  return (
    <section ref={setHost} className={styles.scene}>
      <div className={styles.layer}>
        ${background}
      </div>
${scrimLine}      <div className={styles.content}>
        <h2 className={cx('tb-h3', styles.heading)}>Разбираем задачу по шагам</h2>
        <p className={cx('tb-text-m', styles.lead)}>
          Задайте вопрос по своему коду — Джупсик найдёт место, где ломается логика, и объяснит
          правку.
        </p>
        <div className={styles.actions}>
          <Button iconRight="arrowRight">Начать разбор</Button>
          <Button variant="secondary">Посмотреть пример</Button>
        </div>
      </div>
    </section>
  );
};`;
};

const sectionBackdrop = 0.45;

const HoloMosaicSection = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, dark } = useThemeTokens(host);

  return scene(
    setHost,
    <HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={sectionBackdrop} />
  );
};

export const Section: Story = {
  name: 'HoloMosaic behind a section',
  parameters: {
    docs: {
      source: {
        code: sceneSource(
          '<HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={0.45} />'
        ),
      },
    },
  },
  render: () => <HoloMosaicSection />,
};

const pageBackdrop = 0.6;

const PAGE_SOURCE = `const PageScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.page}>
      <div className={styles.layer}>
        <HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={0.6} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.pageContent}>
        <h2 className={cx('tb-h2', styles.heading)}>Код, который понимает контекст</h2>
        <p className={cx('tb-text-l', styles.lead)}>
          Разбор задач, объяснение ошибок и готовые правки — на одном экране.
        </p>
        <Button iconRight="arrowRight">Открыть пример</Button>
      </div>
    </div>
  );
};`;

const HoloMosaicPage = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.page}>
      <div className={styles.layer}>
        <HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={pageBackdrop} />
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.pageContent}>
        <h2 className={cx('tb-h2', styles.heading)}>Код, который понимает контекст</h2>
        <p className={cx('tb-text-l', styles.lead)}>
          Разбор задач, объяснение ошибок и готовые правки — на одном экране.
        </p>
        <Button iconRight="arrowRight">Открыть пример</Button>
      </div>
    </div>
  );
};

export const Page: Story = {
  name: 'HoloMosaic full page',
  parameters: { docs: { source: { code: PAGE_SOURCE } } },
  render: () => <HoloMosaicPage />,
};

const NeonGlyphsScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return scene(setHost, <NeonGlyphs colors={[accent, text]} lightMode={!dark} opacity={0.7} />);
};

export const NeonGlyphsBackground: Story = {
  name: 'NeonGlyphs',
  parameters: {
    docs: {
      source: {
        code: sceneSource('<NeonGlyphs colors={[accent, text]} lightMode={!dark} opacity={0.7} />'),
      },
    },
  },
  render: () => <NeonGlyphsScene />,
};

const GradientASCIIScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return scene(
    setHost,
    <GradientASCII
      colors={[accent, text]}
      lightMode={!dark}
      gradientOpacity={0.25}
      glyphOpacity={0.45}
      density={0.65}
      glow={0.15}
    />
  );
};

export const GradientASCIISceneStory: Story = {
  name: 'GradientASCII',
  parameters: {
    docs: {
      source: {
        code: sceneSource(
          '<GradientASCII colors={[accent, text]} lightMode={!dark} gradientOpacity={0.25} glyphOpacity={0.45} density={0.65} glow={0.15} />'
        ),
      },
    },
  },
  render: () => <GradientASCIIScene />,
};

const GhostFibersScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return scene(
    setHost,
    <GhostFibers
      glowColor={accent}
      lineColor={text}
      secondaryColor={accent}
      lightMode={!dark}
      brightness={0.75}
      glow={0.7}
      vignette={0.2}
    />
  );
};

export const GhostFibersBackground: Story = {
  name: 'GhostFibers',
  parameters: {
    docs: {
      source: {
        code: sceneSource(
          '<GhostFibers glowColor={accent} lineColor={text} secondaryColor={accent} lightMode={!dark} brightness={0.75} glow={0.7} vignette={0.2} />'
        ),
      },
    },
  },
  render: () => <GhostFibersScene />,
};

const TopographyScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, dark } = useThemeTokens(host);

  return scene(
    setHost,
    <Topography
      color={accent}
      lightMode={!dark}
      opacity={0.8}
      glow={0.7}
      lineWidth={1.5}
      lineCount={18}
    />
  );
};

export const TopographyBackground: Story = {
  name: 'Topography',
  parameters: {
    docs: {
      source: {
        code: sceneSource(
          '<Topography color={accent} lightMode={!dark} opacity={0.8} glow={0.7} lineWidth={1.5} lineCount={18} />'
        ),
      },
    },
  },
  render: () => <TopographyScene />,
};

const SideRaysScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return scene(
    setHost,
    <SideRays
      rayColor1={accent}
      rayColor2={text}
      lightMode={!dark}
      origin="right"
      intensity={2.2}
      opacity={0.85}
    />,
    false
  );
};

export const SideRaysBackground: Story = {
  name: 'SideRays without scrim',
  parameters: {
    docs: {
      description: {
        story:
          'Лучи идут справа, контент стоит слева, поэтому скрим не нужен: фон остаётся светлым и текст не теряется.',
      },
      source: {
        code: sceneSource(
          '<SideRays rayColor1={accent} rayColor2={text} lightMode={!dark} origin="right" intensity={2.2} opacity={0.85} />',
          false
        ),
      },
    },
  },
  render: () => <SideRaysScene />,
};

const AERO_SOURCE = `const AeroShardsScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);
  const { text, accent, dark } = useThemeTokens(host);

  return (
    <section ref={setHost} className={styles.scene}>
      <div className={styles.layer}>
        {failed ? null : (
          <AeroShards
            shardColor={text}
            accentColor={accent}
            lightMode={!dark}
            count={560}
            glow={0.5}
            depthOfField={0.6}
            vignette={0.3}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.content}>
        <h2 className={cx('tb-h3', styles.heading)}>Разбираем задачу по шагам</h2>
        <p className={cx('tb-text-m', styles.lead)}>
          Задайте вопрос по своему коду — Джупсик найдёт место, где ломается логика, и объяснит
          правку.
        </p>
        <div className={styles.actions}>
          <Button iconRight="arrowRight">Начать разбор</Button>
          <Button variant="secondary">Посмотреть пример</Button>
        </div>
      </div>
    </section>
  );
};`;

const AeroShardsScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [failed, setFailed] = useState(false);
  const { text, accent, dark } = useThemeTokens(host);

  return scene(
    setHost,
    failed ? null : (
      <AeroShards
        shardColor={text}
        accentColor={accent}
        lightMode={!dark}
        count={560}
        glow={0.5}
        depthOfField={0.6}
        vignette={0.3}
        onError={() => setFailed(true)}
      />
    )
  );
};

export const AeroShardsBackground: Story = {
  name: 'AeroShards',
  parameters: { docs: { source: { code: AERO_SOURCE } } },
  render: () => <AeroShardsScene />,
};

const GALLERY_SOURCE = `const Gallery = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [aeroFailed, setAeroFailed] = useState(false);
  const { bg, text, accent, dark } = useThemeTokens(host);
  const items = [
    { name: 'HoloMosaic', background: <HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={0.5} /> },
    { name: 'NeonGlyphs', background: <NeonGlyphs colors={[accent, text]} lightMode={!dark} opacity={0.7} /> },
    { name: 'GradientASCII', background: <GradientASCII colors={[accent, text]} lightMode={!dark} gradientOpacity={0.3} glyphOpacity={0.6} /> },
    { name: 'GhostFibers', background: <GhostFibers glowColor={accent} lineColor={text} lightMode={!dark} /> },
    { name: 'Topography', background: <Topography color={accent} lightMode={!dark} lineWidth={1.4} glow={0.8} /> },
    { name: 'SideRays', background: <SideRays rayColor1={accent} rayColor2={text} lightMode={!dark} intensity={2} opacity={0.9} /> },
    { name: 'AeroShards', background: aeroFailed ? null : <AeroShards shardColor={text} accentColor={accent} lightMode={!dark} count={340} shardSize={1.3} glow={0.4} vignette={0.25} onError={() => setAeroFailed(true)} /> },
  ];

  return (
    <div ref={setHost} className={styles.gallery}>
      {items.map((item) => (
        <figure key={item.name} className={styles.cell}>
          <div className={styles.tile}>{item.background}</div>
          <figcaption className={cx('tb-text-xs', styles.caption)}>
            <span className={styles.dot} style={{ background: accent }} aria-hidden="true" />
            {item.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};`;

const GalleryScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [aeroFailed, setAeroFailed] = useState(false);
  const { bg, text, accent, dark } = useThemeTokens(host);
  const items: Array<{ name: string; background: ReactNode }> = [
    {
      name: 'HoloMosaic',
      background: <HoloMosaic color={bg} metalColor={text} lightMode={!dark} opacity={0.5} />,
    },
    {
      name: 'NeonGlyphs',
      background: <NeonGlyphs colors={[accent, text]} lightMode={!dark} opacity={0.7} />,
    },
    {
      name: 'GradientASCII',
      background: (
        <GradientASCII
          colors={[accent, text]}
          lightMode={!dark}
          gradientOpacity={0.3}
          glyphOpacity={0.6}
        />
      ),
    },
    {
      name: 'GhostFibers',
      background: <GhostFibers glowColor={accent} lineColor={text} lightMode={!dark} />,
    },
    {
      name: 'Topography',
      background: <Topography color={accent} lightMode={!dark} lineWidth={1.4} glow={0.8} />,
    },
    {
      name: 'SideRays',
      background: (
        <SideRays
          rayColor1={accent}
          rayColor2={text}
          lightMode={!dark}
          intensity={2}
          opacity={0.9}
        />
      ),
    },
    {
      name: 'AeroShards',
      background: aeroFailed ? null : (
        <AeroShards
          shardColor={text}
          accentColor={accent}
          lightMode={!dark}
          count={340}
          shardSize={1.3}
          glow={0.4}
          vignette={0.25}
          onError={() => setAeroFailed(true)}
        />
      ),
    },
  ];

  return (
    <div ref={setHost} className={styles.gallery}>
      {items.map((item) => (
        <figure key={item.name} className={styles.cell}>
          <div className={styles.tile}>{item.background}</div>
          <figcaption className={cx('tb-text-xs', styles.caption)}>
            <span className={styles.dot} style={{ background: accent }} aria-hidden="true" />
            {item.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export const Gallery: Story = {
  name: 'All backgrounds',
  parameters: { docs: { source: { code: GALLERY_SOURCE } } },
  render: () => <GalleryScene />,
};

const cardFrame = (host: RefCallback<HTMLElement>, card: ReactNode) => (
  <div ref={host} className={styles.cardFrame}>
    {card}
  </div>
);

const MEDIA_CARD_SOURCE = (background: string) => `const CardWithMedia = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, dark } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.cardFrame}>
      <Card>
        <CardMedia>
          <div className={styles.stage}>
            ${background}
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
};`;

const SIDE_CARD_SOURCE = (background: string) => `const CardWithSideMedia = () => {
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
          <CardDescription>
            Медиа сбоку — это position="side" у CardMedia.
          </CardDescription>
        </CardBody>
        <CardFooter>
          <Button size="s" variant="secondary" href="#">
            Открыть
          </Button>
        </CardFooter>
        <CardMedia position="side">
          <div className={styles.stageSide}>
            ${background}
          </div>
        </CardMedia>
      </Card>
    </div>
  );
};`;

const MEDIA_PANEL_SOURCE = (background: string) => `const PanelWithMedia = () => {
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
            ${background}
          </div>
        }
      />
    </div>
  );
};`;

const DETAIL_CARD_SOURCE = (background: string) => `const ProfileCard = () => {
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
            ${background}
          </div>
        }
      />
    </div>
  );
};`;

const CardWithTopMediaScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, dark } = useThemeTokens(host);

  return cardFrame(
    setHost,
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
  );
};

export const CardWithMedia: Story = {
  name: 'Card · media on top',
  parameters: {
    docs: {
      source: {
        code: MEDIA_CARD_SOURCE('<Topography color={accent} lightMode={!dark} opacity={0.8} />'),
      },
    },
  },
  render: () => <CardWithTopMediaScene />,
};

const CardWithSideMediaScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return cardFrame(
    setHost,
    <Card mediaWidth="minmax(200px, 40%)">
      <CardBody>
        <CardHeader>
          <CardTitle>Разбор за вечер</CardTitle>
          <Badge tone="neutral">Видео</Badge>
        </CardHeader>
        <CardDescription>
          Медиа сбоку — это position="side" у CardMedia.
        </CardDescription>
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
  );
};

export const CardWithSideMedia: Story = {
  name: 'Card · media on the side',
  parameters: {
    docs: {
      source: {
        code: SIDE_CARD_SOURCE(
          '<GhostFibers glowColor={accent} lineColor={text} secondaryColor={accent} lightMode={!dark} brightness={0.75} glow={0.7} vignette={0.2} />'
        ),
      },
    },
  },
  render: () => <CardWithSideMediaScene />,
};

const MediaPanelScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { bg, text, dark } = useThemeTokens(host);

  return cardFrame(
    setHost,
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
  );
};

export const MediaPanelWithBackground: Story = {
  name: 'MediaPanel · background instead of a photo',
  parameters: {
    docs: {
      source: {
        code: MEDIA_PANEL_SOURCE('<HoloMosaic color={bg} metalColor={text} lightMode={!dark} />'),
      },
    },
  },
  render: () => <MediaPanelScene />,
};

const DetailCardScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent, dark } = useThemeTokens(host);

  return cardFrame(
    setHost,
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
  );
};

export const DetailCardWithBackground: Story = {
  name: 'DetailCard · background instead of a photo',
  parameters: {
    docs: {
      source: {
        code: DETAIL_CARD_SOURCE(
          '<NeonGlyphs colors={[accent, text]} lightMode={!dark} cellSize={22} perspective={40} depth={20} fade={0.2} />'
        ),
      },
    },
  },
  render: () => <DetailCardScene />,
};
