import { useState } from 'react';
import type { ReactNode, RefCallback } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../../components/ui/Button';
import { cx } from '../../../../lib/cx';
import { useThemeTokens } from '../../../../lib/use-theme-tokens';
import HoloMosaic from '../HoloMosaic';
import AeroShards from '../backgrounds/AeroShards/AeroShards';
import GradientASCII from '../backgrounds/GradientASCII/GradientASCII';
import GhostFibers from '../backgrounds/GhostFibers/GhostFibers';
import NeonGlyphs from '../backgrounds/NeonGlyphs/NeonGlyphs';
import SideRays from '../backgrounds/SideRays/SideRays';
import Topography from '../backgrounds/Topography/Topography';
import styles from './Backgrounds.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/react-bits/Cards/Backgrounds',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Вендорные фоны react-bits лежат рядом исходниками и вызываются напрямую, без обёрток. Canvas/WebGL не понимает var(), поэтому роли --tb-bg, --tb-text-primary и --tb-accent разрешаются в hex хуком useThemeTokens и передаются в цветовые пропсы компонентов; при смене data-theme фон пересчитывается. Поверх фона и под контентом лежит скрим из --tb-bg, чтобы текст оставался читаемым; его снимают только там, где фон не пересекается с текстом (пример SideRays). Фон на месте медиа в карточках — в группе Cards. AeroShards рисует через WebGPU (vgpu): там, где WebGPU нет, onError убирает фон, и сцену держит подложка --tb-bg.',
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
