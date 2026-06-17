import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // sockjs-client (używany przez @stomp/stompjs) odwołuje się do node'owego `global`,
  // którego nie ma w przeglądarce. Webpack/CRA polyfillował go automatycznie, Vite nie.
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
  },
});
