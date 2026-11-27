import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { THEMES } from '../../../styles/themes';
import { Button } from '../Button';
import { Badge, Chip } from '../Display';
import { ThemeScope } from '../ThemeScope';

const meta = {
  title: 'Foundations/Theme provider',
  component: ThemeProvider,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj;

function Picker() {
  const { theme, setTheme } = useTheme();
  const current = THEMES.find((option) => option.value === theme);

  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {THEMES.map((option) => (
          <Chip
            key={option.value}
            active={option.value === theme}
            onClick={() => setTheme(option.value)}
          >
            {option.title}
          </Chip>
        ))}
      </div>

      <ThemeScope
        theme={theme}
        style={{
          display: 'grid',
          gap: 12,
          width: 320,
          padding: 24,
          border: '1px solid var(--tb-border)',
          borderRadius: 'var(--tb-radius-l)',
          background: 'var(--tb-surface)',
        }}
      >
        <strong style={{ font: '600 17px/24px var(--tb-font-heading)' }}>{current?.title}</strong>
        <p
          style={{
            margin: 0,
            color: 'var(--tb-text-secondary)',
            font: '400 15px/24px var(--tb-font-text)',
          }}
        >
          data-theme="{theme}" — цвета, границы и фокус берутся из ролей --tb-*.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button size="s">Действие</Button>
          <Badge tone="accent">Акцент</Badge>
          <Badge tone="success">Успех</Badge>
        </div>
      </ThemeScope>
    </div>
  );
}

function Demo() {
  const [previous] = useState<string | undefined>(() =>
    typeof document === 'undefined' ? undefined : document.documentElement.dataset.theme
  );

  useEffect(
    () => () => {
      document.documentElement.dataset.theme = previous ?? 'light';
    },
    [previous]
  );

  return (
    <ThemeProvider defaultTheme="light">
      <Picker />
    </ThemeProvider>
  );
}

export const Default: Story = {
  render: () => <Demo />,
  parameters: {
    docs: {
      source: {
        code: `<ThemeProvider defaultTheme="light">
  <ThemePicker />
</ThemeProvider>`,
      },
    },
  },
};
