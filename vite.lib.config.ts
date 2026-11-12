import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Two things the library build needs that the app build does not:
// 1. src/index.ts imports no global styles, so @font-face would never reach dist CSS.
// 2. Vite inlines every asset in lib mode; ?no-inline keeps fonts as cacheable files.
const libCss: Plugin = () => ({
  name: 'lib-css',
  enforce: 'pre',
  transform(code, id) {
    if (id.endsWith('/src/index.ts')) {
      return { code: `import './styles/fonts.css';\n${code}`, map: null };
    }
    if (id.endsWith('/src/styles/fonts.css')) {
      return { code: code.replace(/\.woff2(?=['"]?\s*\))/g, (m) => m + '?no-inline'), map: null };
    }
    return null;
  },
});

export default defineConfig({
  // Relative asset URLs: the CSS is loaded from node_modules by consumers.
  base: './',
  plugins: [react(), libCss()],
  // Public assets (demo images) are not part of the package.
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'juce-ui.js',
      cssFileName: 'juce-ui',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-markdown', 'remark-gfm'],
      output: {
        assetFileNames: (asset) =>
          (asset.names ?? []).some((name) => name.endsWith('.css'))
            ? 'juce-ui.css'
            : 'assets/[name][extname]',
      },
    },
  },
});
