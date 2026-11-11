import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/global.css';

const preview: Preview = {
  tags: ['autodocs'],
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
        order: ['Foundations', 'Primitives', 'Blocks', 'Templates', 'Pages'],
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
