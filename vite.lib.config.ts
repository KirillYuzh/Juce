import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const libCss = (): Plugin => ({
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
  base: './',
  plugins: [react(), libCss()],
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
