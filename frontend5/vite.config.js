import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    // checker tylko poza testami — Vitest ustawia process.env.VITEST
    !process.env.VITEST &&
      checker({
        eslint: {
          lintCommand: 'eslint "./src/**/*.{js,jsx}"',
          useFlatConfig: true,
        },
      }),
  ].filter(Boolean),
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