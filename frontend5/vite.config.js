import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';


export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx}"',
        useFlatConfig: true,
      },
    }),
  ],
  // sockjs-client (używany przez @stomp/stompjs) odwołuje się do node'owego `global`,
  // którego nie ma w przeglądarce. Webpack/CRA polyfillował go automatycznie, Vite nie.
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  },
});
