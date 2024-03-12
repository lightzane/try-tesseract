import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4200,
  },
  base: '',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        format: 'umd',
      },
    },
  },
});
