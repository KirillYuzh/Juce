import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const fontsPath = fileURLToPath(new URL('./src/styles/fonts.css', import.meta.url));

const libCss = (): Plugin => ({
  name: 'lib-css',
  enforce: 'pre',
  transform(code, id) {
    if (!id.endsWith('/src/styles/index.css')) return null;
    const fonts = readFileSync(fontsPath, 'utf8').replace(/\.woff2(?=['"]?\s*\))/g, '$&?no-inline');
    return { code: `${code.replace("@import './fonts.css';", '')}\n${fonts}`, map: null };
  },
});

export default defineConfig({
  base: './',
  plugins: [react(), libCss()],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
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
        banner: '"use client";',
        assetFileNames: (asset) =>
          (asset.names ?? []).some((name) => name.endsWith('.css'))
            ? 'juce-ui.css'
            : 'assets/[name][extname]',
      },
    },
  },
});
