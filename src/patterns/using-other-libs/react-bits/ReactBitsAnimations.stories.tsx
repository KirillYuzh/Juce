import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../../components/ui/Button';

import { useThemeTokens } from '../../../lib/use-theme-tokens';
import ElectricLogo from './Animations/ElectricLogo/ElectricLogo';
import TargetCursor from './Animations/TargetCursor/TargetCursor';
import SpecularButton from './Components/SpecularButton/SpecularButton';
import TechText from './TextAnimations/TechText/TechText';
import styles from './ReactBitsAnimations.module.css';

const meta: Meta = {
  title: 'Patterns/Using other libs/react-bits/Text and motion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Вендорные TechText, ElectricLogo, SpecularButton и TargetCursor вызываются напрямую, без обёрток, но работают с нашими токенами и компонентами: цели курсора — Button, логотип — словесный знак из шапки, отрисованный её гарнитурой, текст — гарнитура кита. Canvas/WebGL не понимает var(), поэтому роли --tb-text-primary, --tb-primary и --tb-accent разрешаются в hex хуком useThemeTokens; dark выбирает режим ElectricLogo.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const LOGO_TEXT = 'Джус';

function useNavbarLogoSrc(host: HTMLElement | null): string {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!host) return;
    let alive = true;
    const font = getComputedStyle(host).getPropertyValue('--tb-font-heading').trim();
    document.fonts.load('700 160px Manrope', LOGO_TEXT).then(() => {
      if (!alive) return;
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 240;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = 'white';
      context.font = `700 160px ${font}`;
      context.textBaseline = 'middle';
      context.fillText(LOGO_TEXT, 16, 120);
      setSrc(canvas.toDataURL('image/png'));
    });
    return () => {
      alive = false;
    };
  }, [host]);

  return src;
}

const TechTextScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent } = useThemeTokens(host);
  const fontFamily = host ? getComputedStyle(host).fontFamily : '';

  return (
    <div ref={setHost} className={styles.stage}>
      <TechText
        text="Джус"
        fontFamily={fontFamily}
        color={text}
        accentColor={accent}
        fontSize={150}
      />
    </div>
  );
};

export const TechTextAnimation: Story = {
  name: 'TechText',
  parameters: {
    docs: {
      source: {
        code: `const Scene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, accent } = useThemeTokens(host);
  const fontFamily = host ? getComputedStyle(host).fontFamily : '';

  return (
    <div ref={setHost} className={styles.stage}>
      <TechText text="Джус" fontFamily={fontFamily} color={text} accentColor={accent} fontSize={150} />
    </div>
  );
};`,
      },
    },
  },
  render: () => <TechTextScene />,
};

const ElectricLogoScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, primary, dark } = useThemeTokens(host);
  const logoSrc = useNavbarLogoSrc(host);

  return (
    <div ref={setHost} className={styles.stage}>
      {logoSrc && (
        <ElectricLogo
          src={logoSrc}
          color={primary}
          glowColor={accent}
          theme={dark ? 'dark' : 'light'}
        />
      )}
    </div>
  );
};

export const ElectricLogoAnimation: Story = {
  name: 'ElectricLogo',
  parameters: {
    docs: {
      source: {
        code: `const LOGO_TEXT = 'Джус';

function useNavbarLogoSrc(host: HTMLElement | null): string {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!host) return;
    let alive = true;
    const font = getComputedStyle(host).getPropertyValue('--tb-font-heading').trim();
    document.fonts.load('700 160px Manrope', LOGO_TEXT).then(() => {
      if (!alive) return;
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 240;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.fillStyle = 'white';
      context.font = \`700 160px \${font}\`;
      context.textBaseline = 'middle';
      context.fillText(LOGO_TEXT, 16, 120);
      setSrc(canvas.toDataURL('image/png'));
    });
    return () => {
      alive = false;
    };
  }, [host]);

  return src;
}

const Scene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { accent, primary, dark } = useThemeTokens(host);
  const logoSrc = useNavbarLogoSrc(host);

  return (
    <div ref={setHost} className={styles.stage}>
      {logoSrc && (
        <ElectricLogo src={logoSrc} color={primary} glowColor={accent} theme={dark ? 'dark' : 'light'} />
      )}
    </div>
  );
};`,
      },
    },
  },
  render: () => <ElectricLogoScene />,
};

const SpecularButtonScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, primary } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.stageCentered}>
      <SpecularButton
        size="lg"
        tint={primary}
        tintOpacity={0.12}
        textColor={text}
        baseColor={text}
        lineColor={primary}
      >
        Спросить Джупсика
      </SpecularButton>
    </div>
  );
};

export const SpecularButtonComponent: Story = {
  name: 'SpecularButton',
  parameters: {
    docs: {
      source: {
        code: `<SpecularButton
  size="lg"
  tint={primary}
  tintOpacity={0.12}
  textColor={text}
  baseColor={text}
  lineColor={primary}
>
  Спросить Джупсика
</SpecularButton>`,
      },
    },
  },
  render: () => <SpecularButtonScene />,
};

const TargetCursorScene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, primary } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.stageCentered}>
      <div className={styles.targets}>
        <Button className="cursor-target" data-cursor-label="Начать разбор" iconRight="arrowRight">
          Начать разбор
        </Button>
        <Button className="cursor-target" variant="secondary" data-cursor-label="Открыть пример">
          Открыть пример
        </Button>
        <Button className="cursor-target" variant="secondary" data-cursor-label="Документация">
          Документация
        </Button>
      </div>
      <TargetCursor
        container={host}
        targetSelector=".cursor-target"
        cursorColor={text}
        cursorColorOnTarget={primary}
      />
    </div>
  );
};

export const TargetCursorAnimation: Story = {
  name: 'TargetCursor',
  parameters: {
    docs: {
      source: {
        code: `const Scene = () => {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const { text, primary } = useThemeTokens(host);

  return (
    <div ref={setHost} className={styles.stageCentered}>
      <Button className="cursor-target" data-cursor-label="Начать разбор">Начать разбор</Button>
      <TargetCursor container={host} targetSelector=".cursor-target" cursorColor={text} cursorColorOnTarget={primary} />
    </div>
  );
};`,
      },
    },
  },
  render: () => <TargetCursorScene />,
};
