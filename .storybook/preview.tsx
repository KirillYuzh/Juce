import type { Decorator, Preview } from '@storybook/react-vite';
import { storySource } from '../src/lib/story-source';
import { THEMES } from '../src/styles/themes';
import '../src/styles/index.css';
import './preview.css';

type ThemeGlobals = { theme?: string; skin?: string };

const themeItems: { value: string; title: string }[] = [
  { value: 'light', title: 'Light' },
  { value: 'dark', title: 'Dark' },
  ...THEMES.map(({ value, title }) => ({ value, title })),
];

const withTheme: Decorator = (Story, context) => {
  const globals = context.globals as ThemeGlobals;
  document.documentElement.dataset.theme = globals.theme ?? 'light';
  if (globals.skin && globals.skin !== 'default') {
    document.documentElement.dataset.skin = globals.skin;
  } else {
    delete document.documentElement.dataset.skin;
  }
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  initialGlobals: { theme: 'light', skin: 'default' },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: themeItems,
        dynamicTitle: true,
      },
    },
    skin: {
      description: 'Surface skin',
      toolbar: {
        title: 'Skin',
        icon: 'component',
        items: [
          { value: 'default', title: 'Default' },
          { value: 'blueprint', title: 'Blueprint' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        transform: storySource,
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Foundations', 'Primitives', 'Utilities', 'Chat', 'Blocks', 'Templates', 'Pages'],
      },
    },
    a11y: {
      test: 'error',
    },
  },
};

export default preview;
