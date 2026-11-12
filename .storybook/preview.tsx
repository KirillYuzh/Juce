import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/global.css';
import '../src/styles/utilities.css';
import './preview.css';

// Same contract the package exposes: data-theme on <html> switches the palette.
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme === 'dark' ? 'dark' : 'light';
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
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Foundations', 'Primitives', 'Utilities', 'AI', 'Blocks', 'Templates', 'Pages'],
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
