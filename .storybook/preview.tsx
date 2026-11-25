import type { Decorator, Preview } from '@storybook/react-vite';
import { storySource } from '../src/lib/story-source';
import { THEMES } from '../src/styles/themes';
import '../src/styles/index.css';
import '../src/styles/reset.css';
import './preview.css';

type ThemeGlobals = { theme?: string };

const themeItems: { value: string; title: string }[] = THEMES.map(({ value, title }) => ({
  value,
  title,
}));

const withTheme: Decorator = (Story, context) => {
  const globals = context.globals as ThemeGlobals;
  document.documentElement.dataset.theme = globals.theme ?? 'light';
  return <Story />;
};

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [withTheme],
  initialGlobals: { theme: 'light' },
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
        order: [
          'Foundations',
          'Primitives',
          'Prebuilt',
          'Patterns',
          'Utilities',
          'Chat',
          'Blocks',
          'Templates',
          'Pages',
        ],
      },
    },
  },
};

export default preview;
