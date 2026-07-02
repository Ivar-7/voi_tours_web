import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@shared': resolve(__dirname, './src/shared'),
      '@features': resolve(__dirname, './src/features'),
      '@config': resolve(__dirname, './src/config'),
    },
  },
  build: {
    rolldownOptions: {
      output: {
        // Split the heavyweight vendors out of the entry chunk — without
        // this, firebase + react + framer-motion all land in one >700 kB
        // index chunk that every visitor must download before first paint.
        advancedChunks: {
          groups: [
            { name: 'firebase', test: /node_modules[\\/]@firebase[\\/]/ },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            },
            {
              name: 'framer-motion',
              test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/,
            },
          ],
        },
      },
    },
  },
});

